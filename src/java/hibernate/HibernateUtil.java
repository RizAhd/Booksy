package hibernate;

import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

public class HibernateUtil {

    private static final SessionFactory sessionFactory;

    static {
        try {
            System.out.println("Initializing Hibernate SessionFactory...");
            // Loads hibernate.cfg.xml from classpath (WEB-INF/classes for web apps)
            sessionFactory = new Configuration().configure().buildSessionFactory();
            System.out.println("Hibernate SessionFactory initialized successfully.");
        } catch (Throwable ex) {
            System.err.println("Initial SessionFactory creation failed!");
            // Print the full cause of failure so you can debug
            ex.printStackTrace();
            throw new ExceptionInInitializerError(ex);
        }
    }

    public static SessionFactory getSessionFactory() {
        return sessionFactory;
    }

    public static void shutdown() {
        if (sessionFactory != null) {
            System.out.println("Shutting down Hibernate SessionFactory...");
            sessionFactory.close();
        }
    }
}
