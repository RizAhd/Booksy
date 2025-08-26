/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Address;
import hibernate.Cart;
import hibernate.City;
import hibernate.HibernateUtil;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author rizla
 */
@WebServlet(name = "CheckOut", urlPatterns = {"/CheckOut"})
public class CheckOut extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        User sessionUser = (User) request.getSession().getAttribute("user");
        if (sessionUser == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            responseObject.addProperty("message", "401");
        } else {
            SessionFactory sf = HibernateUtil.getSessionFactory();
            Session s = sf.openSession();
            
            // Query for Address
            Criteria c1 = s.createCriteria(Address.class);
            c1.add(Restrictions.eq("user", sessionUser));
            c1.addOrder(Order.desc("id"));

            if (c1.list().isEmpty()) {
                responseObject.addProperty("message", "Your current address is not found. Please add a new address.");
            } else {
                Address address = (Address) c1.list().get(0);
//                address.getUser().setEmail(null);
                address.getUser().setPassword(null);
                address.getUser().setVerification(null);
                address.getUser().setId(-1);
                address.getUser().setCreated_at(null);

                responseObject.addProperty("status", true);
                responseObject.add("userAddress", gson.toJsonTree(address));
            }

            // Query for Cities
            Criteria c2 = s.createCriteria(City.class);
            c2.addOrder(Order.asc("name"));
            List<City> cityList = c2.list();
            responseObject.add("cityList", gson.toJsonTree(cityList));

            // Corrected Cart Query: Filter by the logged-in user
            Criteria c3 = s.createCriteria(Cart.class);
            c3.add(Restrictions.eq("user", sessionUser));  // Make sure it's filtering by user
            List<Cart> cartList = c3.list();

            if (cartList.isEmpty()) {
                responseObject.addProperty("message", "empty-cart");
            } else {
                for (Cart cart : cartList) {
                    cart.setUser(null);  // Remove user reference to avoid lazy loading issues
                    cart.getBooks().setUser(null);  // Similarly remove book's user reference
                }
                responseObject.addProperty("status", true);
                responseObject.add("cartList", gson.toJsonTree(cartList));
            }
        }

        response.setContentType("application/json");
        String toJson = gson.toJson(responseObject);
        response.getWriter().write(toJson);
    }
}
