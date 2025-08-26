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
import hibernate.User;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import model.Test;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author rizla
 */
@MultipartConfig
@WebServlet(name = "SaveBooks", urlPatterns = {"/SaveBooks"})
public class SaveBooks extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String title = request.getParameter("title");
        String author = request.getParameter("author");
        String isbn = request.getParameter("isbn");
        String description = request.getParameter("description");
        String publishedYear = request.getParameter("publishedYear");
        String price = request.getParameter("price");
        String qty = request.getParameter("qty");
        String categoryID = request.getParameter("categoryID");
        String languageId = request.getParameter("languageId");
        String statusId = request.getParameter("statusId");
        String typeId = request.getParameter("typeId");
        String formatId = request.getParameter("formatId");

        //Image Uploading
        Part img1 = request.getPart("image1");
        Part img2 = request.getPart("image2");
        Part img3 = request.getPart("image3");
        Part img4 = request.getPart("image4");

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();
        //VALIDATIOB FIELDS 
        if (request.getSession().getAttribute("user") == null) {
            responseObject.addProperty("message", "1");

        } else if (title.isEmpty()) {
            responseObject.addProperty("message", "Book title can not be empty");
        } else if (author.isEmpty()) {
            responseObject.addProperty("message", "Author Name can not be empty");

        } else if (description.isEmpty()) {
            responseObject.addProperty("message", "Book description can not be empty");
        } else if (isbn.isEmpty()) {
            responseObject.addProperty("message", "Book isbn can not be empty");
        } else if (publishedYear.isEmpty()) {
            responseObject.addProperty("message", "Book published year can not be empty");
        } else if (description.isEmpty()) {
            responseObject.addProperty("message", "Book description can not be empty");
        } else if (price.isEmpty()) {
            responseObject.addProperty("message", "Book Price can not be empty");

         } else if (Double.parseDouble(price) <= 0) {
            responseObject.addProperty("message", "Price must be greater than 0");
        } else if (!Test.isInteger(qty)) {
            responseObject.addProperty("message", "Invalid quantity");
        } else if (Integer.parseInt(qty) <= 0) {
            responseObject.addProperty("message", "Quantity must be greater than 0");
        } else if (price.isEmpty()) {
            responseObject.addProperty("message", "Book Price can not be empty");
        } else if (!Test.isInteger(languageId)) {
            responseObject.addProperty("message", "Invalid Language!");
        } else if (Integer.parseInt(languageId) == 0) {
            responseObject.addProperty("message", "Please select Your Book Language!");
        } else if (!Test.isInteger(statusId)) {
            responseObject.addProperty("message", "Invalid storage");
        } else if (Integer.parseInt(statusId) == 0) {
            responseObject.addProperty("message", "Please select Your Book Status");

        } else if (!Test.isInteger(typeId)) {
            responseObject.addProperty("message", "Invalid type");
        } else if (Integer.parseInt(typeId) == 0) {
            responseObject.addProperty("message", "Please select Book Type");
        } else if (!Test.isInteger(formatId)) {
            responseObject.addProperty("message", "Invalid Format");
        } else if (Integer.parseInt(formatId) == 0) {
            responseObject.addProperty("message", "Please select Book Format");
        } else if (img1.getSubmittedFileName() == null) {
            responseObject.addProperty("message", "Product image one is required");
        } else if (img2.getSubmittedFileName() == null) {
            responseObject.addProperty("message", "Product image two is required");
        } else if (img3.getSubmittedFileName() == null) {
            responseObject.addProperty("message", "Product image three is required");
        } else if (img4.getSubmittedFileName() == null) {
            responseObject.addProperty("message", "Product image four is required");
        } else {
            Category category = (Category) s.get(Category.class, Integer.valueOf(categoryID));
            if (category == null) {
                responseObject.addProperty("message", "Please select a valid Book Category!");
            } else {

                Language language = (Language) s.get(Language.class, Integer.valueOf(languageId));

                if (language == null) {
                    responseObject.addProperty("message", "Please select a valid Book Language!");
                } else {

                    Status status = (Status) s.get(Status.class, Integer.valueOf(statusId));
                    if (status == null) {
                        responseObject.addProperty("message", "Please select a valid SBook Status!");
                    } else {
                        Type type = (Type) s.get(Type.class, Integer.valueOf(typeId));
                        if (type == null) {
                            responseObject.addProperty("message", "Please select a valid Book Type!");
                        } else {
                            Format format = (Format) s.get(Format.class, Integer.valueOf(formatId));
                            if (format == null) {
                                responseObject.addProperty("message", "Please select a valid Quality!");

                            } else {

                                Books b = new Books();

                                b.setTitle(title);
                                b.setAuthor(author);
                                b.setDescription(description);
                                b.setDescription(description);
                                b.setPrice(Double.parseDouble(price));
                                b.setQty(Integer.parseInt(qty));
                                b.setCategory(category);
                                b.setLanguage(language);
                                b.setStatus(status);
                                b.setPublishedYear(publishedYear);
                                b.setType(type);
                                b.setFormat(format);
                                b.setISBN(isbn);
                                User user = (User) request.getSession().getAttribute("user");

                                b.setUser(user);
                                b.setCreated_at(new Date());
                               
                                
                                
                                b.setCreated_at(new Date());

                                int id = (int) s.save(b);
                                s.beginTransaction().commit();
                                s.close();

                                //Image Uploading
//        Part img1 = request.getPart("image1");
//        Part img2 = request.getPart("image2");
//        Part img3 = request.getPart("image3");
//        Part img4 = request.getPart("image4");
                                //C:\\Users\\rizla\\Documents\\NetBeansProjects\\booksy\\web\\bookimg
                                String appPath = getServletContext().getRealPath("");

                                String newPath = appPath + File.separator + "Book-Img";

                                File bookFolder = new File(newPath, String.valueOf(id));
                                bookFolder.mkdir();

                                File file1 = new File(bookFolder, "image1.png");
                                Files.copy(img1.getInputStream(), file1.toPath(), StandardCopyOption.REPLACE_EXISTING);

                                File file2 = new File(bookFolder, "image2.png");
                                Files.copy(img2.getInputStream(), file2.toPath(), StandardCopyOption.REPLACE_EXISTING);

                                File file3 = new File(bookFolder, "image3.png");
                                Files.copy(img3.getInputStream(), file3.toPath(), StandardCopyOption.REPLACE_EXISTING);

                                File file4 = new File(bookFolder, "image4.png");
                                Files.copy(img4.getInputStream(), file4.toPath(), StandardCopyOption.REPLACE_EXISTING);

                           responseObject.addProperty("status", true);
                            
      
       
                            }
                        }
                    }
                }
            }
        }

  Gson gson = new Gson();
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseObject));
    }

}
