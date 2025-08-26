/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Books;
import hibernate.Category;
import hibernate.HibernateUtil;
import hibernate.Status;
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
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author rizla
 */
@WebServlet(name = "LoadIndexData", urlPatterns = {"/LoadIndexData"})
public class LoadIndexData extends HttpServlet {

    private static final int ACTIVE_STATUS_ID = 1;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

        Criteria c1 = s.createCriteria(Category.class);
        List<Category> categoryList = c1.list();
        responseObject.add("categoryList", gson.toJsonTree(categoryList));

        Criteria c2 = s.createCriteria(Books.class);
        c2.addOrder(Order.desc("id"));

        Status status = (Status) s.get(Status.class, LoadIndexData.ACTIVE_STATUS_ID);
        c2.add(Restrictions.eq("status", status));

        c2.setFirstResult(0);
        c2.setMaxResults(8);

        List<Books> booksList = c2.list();
        for (Books books : booksList) {
            books.setUser(null);
        }

        responseObject.add("booksList", gson.toJsonTree(booksList));

        responseObject.addProperty("status", true);
        response.setContentType("application/json");
        String toJson = gson.toJson(responseObject);
        response.getWriter().write(toJson);

    }

}
