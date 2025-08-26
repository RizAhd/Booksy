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
import hibernate.Language;
import hibernate.Status;
import hibernate.Type;
import hibernate.Format;
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
@WebServlet(name = "SearchBooks", urlPatterns = {"/SearchBooks"})
public class SearchBooks extends HttpServlet {

    private static final int MAX_RESULT = 6;  // Set this to 6, as per your requirements

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        JsonObject requestJsonObject = gson.fromJson(request.getReader(), JsonObject.class);

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

        Criteria c1 = s.createCriteria(Books.class); // Get all products for filtering

        // Add filtering logic (based on category, language, status, etc.)
        if (requestJsonObject.has("categoryName")) {
            String categoryName = requestJsonObject.get("categoryName").getAsString();
            Criteria c2 = s.createCriteria(Category.class);
            c2.add(Restrictions.eq("type", categoryName));
            Category category = (Category) c2.uniqueResult();
            c1.add(Restrictions.eq("category", category));
        }

        // Apply price range filters if any
        if (requestJsonObject.has("priceStart") && requestJsonObject.has("priceEnd")) {
            double priceStart = requestJsonObject.get("priceStart").getAsDouble();
            double priceEnd = requestJsonObject.get("priceEnd").getAsDouble();
            c1.add(Restrictions.ge("price", priceStart));
            c1.add(Restrictions.le("price", priceEnd));
        }

        // Sort the results based on sort value
        if (requestJsonObject.has("sortValue")) {
            String sortValue = requestJsonObject.get("sortValue").getAsString();
            if (sortValue.equals("Sort by Latest")) {
                c1.addOrder(Order.desc("id"));
            } else if (sortValue.equals("Sort by Oldest")) {
                c1.addOrder(Order.asc("id"));
            } else if (sortValue.equals("Sort by Name")) {
                c1.addOrder(Order.asc("title"));
            } else if (sortValue.equals("price-low")) {
                c1.addOrder(Order.asc("price"));
            } else if (sortValue.equals("price-high")) {
                c1.addOrder(Order.desc("price"));
            }
        }

        // Only fetch active books
        Status status = (Status) s.get(Status.class, 1); // get Active product [2 = Active]
        c1.add(Restrictions.eq("status", status));

        // Get the total number of books for pagination
        responseObject.addProperty("allBooksCount", c1.list().size());

        // Apply pagination
        if (requestJsonObject.has("firstResult")) {
            int firstResult = requestJsonObject.get("firstResult").getAsInt();
            c1.setFirstResult(firstResult);  // Correct pagination start index
            c1.setMaxResults(MAX_RESULT);  // Maximum results per page (6 in this case)
            System.out.println(firstResult);
        }

        // Get the list of books to return based on filters and pagination
        List<Books> booksList = c1.list();
        for (Books books : booksList) {
            books.setUser(null); // Exclude unnecessary data
        }

        // Close the session
        s.close();

        // Return the filtered and paginated book list as JSON
        responseObject.add("booksList", gson.toJsonTree(booksList));
        responseObject.addProperty("status", true);
        response.setContentType("application/json");
        String toJson = gson.toJson(responseObject);
        response.getWriter().write(toJson);
    }
}
