package controller;



import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Books;
import hibernate.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.Query;  // Use the non-generic Query class for older Hibernate versions
import org.hibernate.HibernateException;

import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;
import javax.servlet.annotation.WebServlet;

@WebServlet(name = "SingleBV", urlPatterns = {"/GetBookDetails"})
public class SingleBV extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
      
        
        // Initialize response object
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

      
        String bookId = request.getParameter("id");

        // Check if the book ID is missing
        if (bookId == null || bookId.isEmpty()) {
            responseObject.addProperty("message", "Book ID is missing");
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(new Gson().toJson(responseObject));
            return;
        }

        // Fetch book details using Session.get() method
        Session session = HibernateUtil.getSessionFactory().openSession();
        try {
            Books book = (Books) session.get(Books.class, Integer.parseInt(bookId));  // Fetch book by ID

            // If book is found, populate response
            if (book != null) {
                responseObject.addProperty("status", true);
                responseObject.add("book", new Gson().toJsonTree(book));  // Convert book object to JSON
            } else {
                // If book not found, send a "Not Found" response
                responseObject.addProperty("message", "Book not found");
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            }
        } catch (Exception e) {
            responseObject.addProperty("message", "Error fetching book details");
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            e.printStackTrace();
        } finally {
            session.close();  // Ensure session is closed
        }

        // Convert response object to JSON and send it to the client
        String toJson = new Gson().toJson(responseObject);
        response.setContentType("application/json");
        response.getWriter().write(toJson);
    }

}


