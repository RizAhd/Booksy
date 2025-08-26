package controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.OrderItem;
import hibernate.OrderStatus;
import hibernate.Orders;
import hibernate.User;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet(name = "Order", urlPatterns = {"/Order"})
public class Order extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Initialize Gson and response object
        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        // Get the logged-in user
        User user = (User) request.getSession().getAttribute("user");

        // Check if the user is logged in
        if (user == null) {
            responseObject.addProperty("message", "Session expired! Please log in again.");
            response.setContentType("application/json");
            response.getWriter().write(gson.toJson(responseObject));
            return;
        }

        // Open Hibernate session
        SessionFactory sessionFactory = HibernateUtil.getSessionFactory();
        Session session = sessionFactory.openSession();
        Transaction transaction = session.beginTransaction();

        try {
            // Fetch orders based on user ID
            Criteria orderCriteria = session.createCriteria(Orders.class);
            orderCriteria.add(Restrictions.eq("user", user));
            List<Orders> ordersList = orderCriteria.list();

            // Check if orders are found
            if (ordersList.isEmpty()) {
                responseObject.addProperty("message", "No orders found for this user.");
                response.setContentType("application/json");
                response.getWriter().write(gson.toJson(responseObject));
                return;
            }

            // Create an array to store all orders
            JsonArray ordersArray = new JsonArray();

            // Prepare the order details to send to the frontend
            for (Orders order : ordersList) {
                JsonObject orderJson = new JsonObject();
                orderJson.addProperty("order_id", order.getId());
                orderJson.addProperty("created_at", order.getCreated_at().toString());

                // Fetch order items
                Criteria orderItemCriteria = session.createCriteria(OrderItem.class);
                orderItemCriteria.add(Restrictions.eq("order", order));
                List<OrderItem> orderItems = orderItemCriteria.list();

                // Add order items details
                for (OrderItem item : orderItems) {
                    JsonObject itemJson = new JsonObject();
                    itemJson.addProperty("book_title", item.getBooks().getTitle());
                    itemJson.addProperty("book_author", item.getBooks().getAuthor());
                    itemJson.addProperty("quantity", item.getQty());
                    itemJson.addProperty("price", item.getBooks().getPrice());
                    orderJson.add("order_item", itemJson);
                    
                    // Adding order status
                    OrderStatus orderStatus = item.getOrderStatus();
                    orderJson.addProperty("order_status", orderStatus.getType());
                }

                // Add the order to the orders array
                ordersArray.add(orderJson);
            }

            // Add the orders array to the response object
            responseObject.add("orders", ordersArray);

            responseObject.addProperty("status", true);
            response.setContentType("application/json");
            response.getWriter().write(gson.toJson(responseObject));
            transaction.commit();

        } catch (Exception e) {
            transaction.rollback();
            responseObject.addProperty("message", "Error retrieving order details: " + e.getMessage());
            response.setContentType("application/json");
            response.getWriter().write(gson.toJson(responseObject));
        } finally {
            session.close();
        }
    }
}
