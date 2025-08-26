/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Books;
import hibernate.Cart;
import hibernate.HibernateUtil;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.Test;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author rizla
 */
@WebServlet(name = "AddCart", urlPatterns = {"/AddCart"})
public class AddCart extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String BId = request.getParameter("BId");
        String qty = request.getParameter("qty");

        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        if (!Test.isInteger(BId)) {
            responseObject.addProperty("message", "Invalid book Id!");
        } else if (!Test.isInteger(qty)) {
            responseObject.addProperty("message", "Invalid book Quantity!");
        } else {

            SessionFactory sf = HibernateUtil.getSessionFactory();
            Session s = sf.openSession();
            Transaction tr = s.beginTransaction();

            Books books = (Books) s.get(Books.class, Integer.valueOf(BId));
            if (books == null) {
                responseObject.addProperty("message", "books not found");
            } else {

                User user = (User) request.getSession().getAttribute("user");
                if (user != null) {
                    Criteria c1 = s.createCriteria(Cart.class);
                    c1.add(Restrictions.eq("user", user));
                    c1.add(Restrictions.eq("books", books));
                    if (c1.list().isEmpty()) {
                        if (Integer.parseInt(qty) <= books.getQty()) { // product quantity available

                            Cart cart = new Cart();
                            cart.setQty(Integer.parseInt(qty));
                            cart.setUser(user);
                            cart.setBooks(books);

                            s.save(cart);
                            tr.commit();
                            responseObject.addProperty("status", true);
                            responseObject.addProperty("message", "Book add to cart successfully");
                        } else {

                            responseObject.addProperty("message", "Book Quantity Not Available");

                        }
                    } else {

                        Cart cart = (Cart) c1.uniqueResult();
                        int newQty = cart.getQty() + Integer.parseInt(qty);
                        if (newQty <= books.getQty()) {

                            cart.setQty(newQty);
                            s.update(cart);
                            tr.commit();
                            responseObject.addProperty("status", true);
                            responseObject.addProperty("message", "Cart Updated Successfully....!");
                        } else {

                            responseObject.addProperty("message", "Book Quantity Not Available");

                        }
                    }

                } else {
                    HttpSession ses = request.getSession();

                    if (ses.getAttribute("sessionCart") == null) { // sessionCart not-available in the session
                        if (Integer.parseInt(qty) <= books.getQty()) {

                            ArrayList<Cart> sessCarts = new ArrayList<>();
                            Cart cart = new Cart();
                            cart.setQty(Integer.parseInt(qty));
                            cart.setUser(null);
                            cart.setBooks(books);
                            sessCarts.add(cart);
                            ses.setAttribute("sessionCart", sessCarts);
                            responseObject.addProperty("status", true);
                            responseObject.addProperty("message", "Product added to the cart");
                        } else {
                            responseObject.addProperty("message", "Book Quantity Not Available");

                        }
                    } else {
                        ArrayList<Cart> sessionList = (ArrayList<Cart>) ses.getAttribute("sessionCart");
                        Cart foundedCart = null;
                        for (Cart cart : sessionList) {

                            if (cart.getBooks().getId() == books.getId()) {
                                foundedCart = cart; // reassigned by using the exists cart
                                break;

                            }
                        }
                        if (foundedCart != null) {
                            int newQty = foundedCart.getQty() + Integer.parseInt(qty);

                            if (Integer.parseInt(qty) <= books.getQty()) {
                                  foundedCart.setUser(null);
                                foundedCart.setQty(newQty);
                                responseObject.addProperty("status", Boolean.TRUE);
                                responseObject.addProperty("message", "Product cart updated");
                            } else {
                                responseObject.addProperty("message", "Book Quantity Not Available");

                            }
                        } else {
                            foundedCart = new Cart(); // asign a new Cart object
                            foundedCart.setQty(Integer.parseInt(qty));
                            foundedCart.setUser(null);
                            foundedCart.setBooks(books);
                            sessionList.add(foundedCart);
                            responseObject.addProperty("status", Boolean.TRUE);
                            responseObject.addProperty("message", "Product  Add to cart");

                        }

                    }
                }

            }

        }
//       
        // add-to-cart-process-end
        response.setContentType("application/json");
        String toJson = gson.toJson(responseObject);
        response.getWriter().write(toJson);

    }

}
