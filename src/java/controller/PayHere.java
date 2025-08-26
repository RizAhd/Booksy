package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Address;
import hibernate.Books;
import hibernate.Cart;
import hibernate.City;
import hibernate.HibernateUtil;
import hibernate.OrderItem;
import hibernate.OrderStatus;
import hibernate.User;
import hibernate.Orders;
import java.io.IOException;
import java.text.DecimalFormat;
import java.util.Date;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.Test;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "PayHere", urlPatterns = {"/PayHere"})
public class PayHere extends HttpServlet {

    private static final int DEFAULT_VALUE = 0;
    private static final int ORDER_PENDING = 5;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
        Gson gson = new Gson();
        JsonObject requJsonObject = gson.fromJson(request.getReader(), JsonObject.class);

        // Extracting data from JSON request
        boolean isCurrentAddress = requJsonObject.get("isCurrentAddress").getAsBoolean();
        String firstName = requJsonObject.get("firstName").getAsString();
        String lastName = requJsonObject.get("lastName").getAsString();
        String citySelect = requJsonObject.get("citySelect").getAsString();
        String lineOne = requJsonObject.get("lineOne").getAsString();
        String lineTwo = requJsonObject.get("lineTwo").getAsString();
        String postalCode = requJsonObject.get("postalCode").getAsString();
        String mobile = requJsonObject.get("mobile").getAsString();

        // Open Hibernate session
        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();
        Transaction tr = s.beginTransaction();

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        // Fetch the user object from the session
        User user = (User) request.getSession().getAttribute("user");

        // Check if user is logged in
        if (user == null) {
            responseObject.addProperty("message", "Session expired! Please log in again.");
            response.setContentType("application/json");
            response.getWriter().write(gson.toJson(responseObject));
            return; // Stop further execution if no user is found in session
        }

        // Process checkout
        if (isCurrentAddress) {
            Criteria c1 = s.createCriteria(Address.class);
            c1.add(Restrictions.eq("user", user));
            c1.addOrder(org.hibernate.criterion.Order.desc("id"));
            List<Address> addressList = c1.list();
            if (addressList.isEmpty()) {
                responseObject.addProperty("message", "Your current address is not found. Please add a new address.");
                response.setContentType("application/json");
                response.getWriter().write(gson.toJson(responseObject));
                return;
            }
            Address address = addressList.get(0);
            processCheckout(s, tr, user, address, responseObject);
        } else {
            // Validate the provided address information
            if (firstName.isEmpty()) {
                responseObject.addProperty("message", "First Name is required.");
            } else if (lastName.isEmpty()) {
                responseObject.addProperty("message", "Last Name is required.");
            } else if (!Test.isInteger(citySelect)) {
                responseObject.addProperty("message", "Invalid city");
            } else if (Integer.parseInt(citySelect) == DEFAULT_VALUE) {
                responseObject.addProperty("message", "Invalid city");
            } else {
                City city = (City) s.get(City.class, Integer.valueOf(citySelect));
                if (city == null) {
                    responseObject.addProperty("message", "Invalid city name");
                } else {
                    if (lineOne.isEmpty()) {
                        responseObject.addProperty("message", "Address line one is required");
                    } else if (lineTwo.isEmpty()) {
                        responseObject.addProperty("message", "Address line two is required");
                    } else if (postalCode.isEmpty()) {
                        responseObject.addProperty("message", "Your postal code is required");
                    } else if (mobile.isEmpty()) {
                        responseObject.addProperty("message", "Mobile number is required");
                    } else if (!Test.isMobileValid(mobile)) {
                        responseObject.addProperty("message", "Invalid mobile number");
                    } else {
                        Address address = new Address();
                        address.setFirstName(firstName);
                        address.setLastName(lastName);
                        address.setLineOne(lineOne);
                        address.setLineTwo(lineTwo);
                        address.setCity(city);
                        address.setPostalCode(postalCode);
                        address.setMobile(mobile);
                        address.setUser(user);
                        s.save(address);

                        processCheckout(s, tr, user, address, responseObject);
                    }
                }
            }
        }

        // Send response back to the client
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseObject));
    }

    private void processCheckout(Session s, Transaction tr, User user, Address address, JsonObject responseObject) {
        try {
            Orders orders = new Orders();
            orders.setAddress(address);
            orders.setCreated_at(new Date());
            orders.setUser(user);

            int orderId = (int) s.save(orders);

            Criteria c1 = s.createCriteria(Cart.class);
            c1.add(Restrictions.eq("user", user));
            List<Cart> cartList = c1.list();

            OrderStatus orderStatus = (OrderStatus) s.get(OrderStatus.class, ORDER_PENDING);

            double amount = 0;
            String items = "";

            for (Cart cart : cartList) {
                amount += cart.getQty() * cart.getBooks().getPrice();

                OrderItem orderItems = new OrderItem();
                items += cart.getBooks().getTitle() + " x " + cart.getQty() + ", ";

                Books book = cart.getBooks();
                orderItems.setOrderStatus(orderStatus);
                orderItems.setOrder(orders);
                orderItems.setBooks(book);
                orderItems.setQty(cart.getQty());
                s.save(orderItems);

                // Update product qty
                book.setQty(book.getQty() - cart.getQty());
                s.update(book);

                // Delete cart item
                s.delete(cart);
            }

            tr.commit();

            // PayHere process (log the parameters for debugging)
            String merchantID = "";
            String merchantSecret = "";
            String orderID = "#000" + orderId;
            String currency = "LKR";
            String formattedAmount = new DecimalFormat("0.00").format(amount);
            String merchantSecretMD5 = model.PayHere.generateMD5(merchantSecret);

            // Debug log - Print parameters
            System.out.println("merchantID: " + merchantID);
            System.out.println("orderID: " + orderID);
            System.out.println("formattedAmount: " + formattedAmount);
            System.out.println("currency: " + currency);
            System.out.println("merchantSecretMD5: " + merchantSecretMD5);

            String hash = model.PayHere.generateMD5(merchantID + orderID + formattedAmount + currency + merchantSecretMD5);

            // Debug: Log the generated hash
            System.out.println("Generated Hash: " + hash);

            JsonObject payHereJson = new JsonObject();
            payHereJson.addProperty("sandbox", true);
            payHereJson.addProperty("merchant_id", merchantID);
            payHereJson.addProperty("return_url", "");
            payHereJson.addProperty("cancel_url", "");
            payHereJson.addProperty("notify_url", "https://famous-towns-chew.loca.lt/booksy/VerifyPayment");
            payHereJson.addProperty("order_id", orderID);
            payHereJson.addProperty("items", items);
            payHereJson.addProperty("amount", formattedAmount);
            payHereJson.addProperty("currency", currency);
            payHereJson.addProperty("hash", hash);

            payHereJson.addProperty("first_name", user.getFirst_name());
            payHereJson.addProperty("last_name", user.getLast_name());
            payHereJson.addProperty("email", user.getEmail());

            payHereJson.addProperty("phone", address.getMobile());
            payHereJson.addProperty("address", address.getLineOne() + ", " + address.getLineTwo());
            payHereJson.addProperty("city", address.getCity().getName());
            payHereJson.addProperty("country", "Sri Lanka");

            responseObject.addProperty("status", true);
            responseObject.addProperty("message", "Checkout completed");
            responseObject.add("payhereJson", new Gson().toJsonTree(payHereJson));

        } catch (Exception e) {
            tr.rollback();
            responseObject.addProperty("message", "Error during checkout: " + e.getMessage());
        }
    }
}
