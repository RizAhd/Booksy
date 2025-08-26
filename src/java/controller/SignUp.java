/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.Mail;
import model.Test;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.User;
import java.io.IOException;
import java.util.Date;
import javax.servlet.http.HttpSession;

@WebServlet(name = "SignUp", urlPatterns = {"/SignUp"})
public class SignUp extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();
        JsonObject user = gson.fromJson(request.getReader(), JsonObject.class);

        String firstName = user.get("firstName").getAsString();
        String lastName = user.get("lastName").getAsString();
        final String email = user.get("email").getAsString();
        String mobile = user.get("mobile").getAsString();
        String password = user.get("password").getAsString();

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        if (firstName.isEmpty()) {
            responseObject.addProperty("message", "First name cannot be empty");
        } else if (lastName.isEmpty()) {
            responseObject.addProperty("message", "Last name cannot be empty");
        } else if (email.isEmpty()) {
            responseObject.addProperty("message", "Email name cannot be empty");
        } else if (!Test.isEmailValid(email)) {
            responseObject.addProperty("message", "Please enter valid email");
        } else if (mobile.isEmpty()) {
            responseObject.addProperty("message", "Please enter mobile number");
        } else if (!Test.isMobileValid(mobile)) {
            responseObject.addProperty("message", "Please enter valid mobile number");

        } else if (password.isEmpty()) {
            responseObject.addProperty("message", "Password name cannot be empty");
        } else if (!Test.isPasswordValid(password)) {
            responseObject.addProperty("message", "Please enter valid password");
        } else {
            SessionFactory sf = HibernateUtil.getSessionFactory();
            Session s = sf.openSession();

            Criteria criteria = s.createCriteria(User.class);
            criteria.add(Restrictions.eq("email", email));

            if (!criteria.list().isEmpty()) {
                responseObject.addProperty("message", "This User already added!");
            }else{
                
                 
            User u = new User();
            u.setFirst_name(firstName);
            u.setLast_name(lastName);
            u.setEmail(email);
            u.setMobile(mobile);
            u.setPassword(password);

            final String code = Test.generateCode();
            u.setVerification(code);

            u.setCreated_at(new Date());

            s.save(u);
            s.beginTransaction().commit();

            //Send Email
            new Thread(new Runnable() {
                @Override
                public void run() {
                    Mail.sendMail(email, "Verification Code", "<html>\n"
                            + "<head>\n"
                            + "  <meta charset=\"UTF-8\">\n"
                            + "  <style>\n"
                            + "    body {\n"
                            + "      background: #f9fafb;\n"
                            + "      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n"
                            + "    }\n"
                            + "    .container {\n"
                            + "      max-width: 420px;\n"
                            + "      margin: 40px auto;\n"
                            + "      background: #ffffff;\n"
                            + "      border-radius: 12px;\n"
                            + "      padding: 30px;\n"
                            + "      box-shadow: 0 8px 20px rgba(0,0,0,0.05);\n"
                            + "      text-align: center;\n"
                            + "    }\n"
                            + "    h2 {\n"
                            + "      margin-bottom: 10px;\n"
                            + "      color: #333;\n"
                            + "    }\n"
                            + "    p {\n"
                            + "      color: #555;\n"
                            + "      margin-bottom: 20px;\n"
                            + "    }\n"
                            + "    .code {\n"
                            + "      font-size: 24px;\n"
                            + "      letter-spacing: 6px;\n"
                            + "      color: #0d6efd;\n"
                            + "      background: #f0f4ff;\n"
                            + "      padding: 15px 20px;\n"
                            + "      border-radius: 10px;\n"
                            + "      display: inline-block;\n"
                            + "      font-weight: bold;\n"
                            + "    }\n"
                            + "    .footer {\n"
                            + "      margin-top: 30px;\n"
                            + "      font-size: 12px;\n"
                            + "      color: #888;\n"
                            + "    }\n"
                            + "  </style>\n"
                            + "</head>\n"
                            + "<body>\n"
                            + "  <div class=\"container\">\n"
                            + "    <h2>Booksy - Email Verification</h2>\n"
                            + "    <p>Use the code below to verify your email address:</p>\n"
                            + "    <div class=\"code\"> <h1>" + code + "</h1></div>\n"
                            + "    <p class=\"footer\">If you didn’t request this, you can safely ignore this email.</p>\n"
                            + "  </div>\n"
                            + "</body>\n"
                            + "</html>");
                }
            }
            ).start();
            
            //Session management
                HttpSession ses =  request.getSession();
                ses.setAttribute("email", email);
            ///
               responseObject.addProperty("status", true);
                responseObject.addProperty("message", "Registration successfully.Please check your email for verification code");
                
            }
            
           s.close();
            //Send Email
        }

        String responseText = gson.toJson(responseObject);
        response.setContentType("application/json");
        response.getWriter().write(responseText);

//        else{
//        
    }
}
