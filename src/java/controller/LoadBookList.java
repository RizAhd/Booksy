package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Books;
import hibernate.HibernateUtil;
import hibernate.User;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet(name = "LoadBookList", urlPatterns = {"/LoadBookList"})
public class LoadBookList extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        // Get the logged-in user from session
        User user = (User) request.getSession().getAttribute("user");

        if (user != null) {
            SessionFactory sf = HibernateUtil.getSessionFactory();
            Session session = sf.openSession();

            try {
                // Use Hibernate Criteria to fetch books uploaded by the logged-in user
                Criteria criteria = session.createCriteria(Books.class);
                criteria.add(Restrictions.eq("user", user)); // Filter books by logged-in user
                List<Books> booksList = criteria.list();

                if (booksList.isEmpty()) {
                    responseObject.addProperty("message", "You have not uploaded any books yet.");
                } else {
                    responseObject.addProperty("status", true);
                    responseObject.addProperty("message", "Books loaded successfully.");
                    // Remove sensitive user data (user reference) before sending it to the frontend
                    for (Books book : booksList) {
                        book.setUser(null); // Remove user reference from book object
                    }
                    responseObject.add("books", gson.toJsonTree(booksList));  // Return books as JSON
                }

            } catch (Exception e) {
                e.printStackTrace();
                responseObject.addProperty("message", "Error while loading books.");
            } finally {
                session.close();
            }
        } else {
            responseObject.addProperty("message", "User is not logged in.");
        }

        // Send JSON response
        response.setContentType("application/json");
        String jsonResponse = gson.toJson(responseObject);
        response.getWriter().write(jsonResponse);  // Send the response back to the client
    }
}