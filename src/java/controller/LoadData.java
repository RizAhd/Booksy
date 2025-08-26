/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Books;
import hibernate.Category;
import hibernate.Format;
import hibernate.HibernateUtil;
import hibernate.Language;
import hibernate.Status;
import hibernate.Type;
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
@WebServlet(name = "LoadData", urlPatterns = {"/LoadData"})
public class LoadData extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

        Criteria c1 = s.createCriteria(Category.class);
        List<Category> categoryList = c1.list();

        Criteria c2 = s.createCriteria(Language.class);
        List<Language> languageList = c2.list();

        Criteria c3 = s.createCriteria(Status.class);
        List<Status> statusList = c3.list();

        Criteria c4 = s.createCriteria(Type.class);
        List<Type> typeList = c4.list();

        Criteria c5 = s.createCriteria(Format.class);
        List<Format> formatList = c5.list();

      
        //load-product-data
        Status status = (Status) s.get(Status.class, 1);
        Criteria c6 = s.createCriteria(Books.class);
        c6.addOrder(Order.desc("id"));
        c6.add(Restrictions.eq("status", status));
        responseObject.addProperty("allBooksCount", c6.list().size());
        
        c6.setFirstResult(0);
        c6.setMaxResults(6);

        List<Books> booksList = c6.list();
        for (Books books : booksList) {
            books.setUser(null);
        }

        Gson gson = new Gson();

        responseObject.add("categoryList", gson.toJsonTree(categoryList));
        responseObject.add("languageList", gson.toJsonTree(languageList));
        responseObject.add("statusList", gson.toJsonTree(statusList));
        responseObject.add("typeList", gson.toJsonTree(typeList));
        responseObject.add("formatList", gson.toJsonTree(formatList));

        responseObject.addProperty("allBooksCount", booksList.size());
        responseObject.add("booksList", gson.toJsonTree(booksList));

        responseObject.addProperty("status", true);

        String toJson = gson.toJson(responseObject);
        response.setContentType("application/json");
        response.getWriter().write(toJson);
        s.close();
    }

}
