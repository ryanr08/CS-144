import java.io.IOException;
import java.sql.* ;
import java.util.List;
import java.util.ArrayList;
import java.util.Date;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import org.commonmark.node.*;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.html.HtmlRenderer;

import java.io.IOException;
import java.io.PrintWriter;

/**
 * Servlet implementation class for Servlet: ConfigurationTest
 *
 */
public class Editor extends HttpServlet {

    /**
     * The Servlet constructor
     * 
     * @see javax.servlet.http.HttpServlet#HttpServlet()
     */
    public Editor() { }

    public void init() throws ServletException
    {

    }
    
    public void destroy()
    {

    }

    /**
     * Handles HTTP GET requests
     * 
     * @see javax.servlet.http.HttpServlet#doGet(HttpServletRequest request,
     *      HttpServletResponse response)
     */
    public void doGet(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException 
    {
        // get the action parameter from http request in order to direct to proper page
        String action = "";
        if (request.getParameterMap().containsKey("action") != false){
            action = request.getParameter("action").toString();
        }
        else{
            response.setStatus(404);
        }

        // handle open action
        if (action.equals("open"))
        {
            handleOpen(request, response);
        }
        // handle list action
        else if (action.equals("list"))
        {
            handleList(request, response); 
        }
        else if (action.equals("preview"))
        {
            handlePreview(request, response);
        }
        else
        {
            response.setStatus(400);
        }

    }
    
    /**
     * Handles HTTP POST requests
     * 
     * @see javax.servlet.http.HttpServlet#doPost(HttpServletRequest request,
     *      HttpServletResponse response)
     */
    public void doPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException 
    {
        // get the action parameter from http request in order to direct to proper page
        String action = "";
        if (request.getParameterMap().containsKey("action") != false){
            action = request.getParameter("action").toString();
        }
        else{
            response.setStatus(404);
        }

        if (action.equals("open"))
        {
            handleOpen(request, response);
        }
        else if (action.equals("list"))
        {
            handleList(request, response); 
        }
        else if (action.equals("preview"))
        {
            handlePreview(request, response);
        }
        else if (action.equals("save"))
        {
            handleSave(request, response);
        }
        else if (action.equals("delete"))
        {
            handleDelete(request, response);
        }
        else
        {
            response.setStatus(400);
        }
    }

    // function to handle an open request
    private void handleOpen(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException 
    {
        if (request.getParameterMap().containsKey("username") != false && request.getParameterMap().containsKey("postid") != false)
        {
            int postid;
            try{
                postid = Integer.parseInt(request.getParameter("postid").toString());
            }
            catch (NumberFormatException ex){
                response.setStatus(400);
                return;
            }
            String username = request.getParameter("username").toString();
            request.setAttribute("username", username);
            request.setAttribute("postid", postid);

            String title = "";
            String body = "";

            if (postid == 0){
                if (request.getParameterMap().containsKey("title") != false){
                    title = request.getParameter("title").toString();
                }
                if (request.getParameterMap().containsKey("body") != false){
                    body = request.getParameter("body").toString();
                }
                request.setAttribute("title", title);
                request.setAttribute("body", body);
                response.setStatus(200);
                request.getRequestDispatcher("/edit.jsp").forward(request, response);
            }
            else if (postid > 0) {
                if (request.getParameterMap().containsKey("title") != false && request.getParameterMap().containsKey("body") != false){
                    title = request.getParameter("title").toString();
                    body = request.getParameter("body").toString();

                    request.setAttribute("title", title);
                    request.setAttribute("body", body);

                    response.setStatus(200);
                    request.getRequestDispatcher("/edit.jsp").forward(request, response);
                }                   
                else{
                    Connection conn = null;
                    PreparedStatement open_stmt = null;
                    ResultSet rs = null;
                    try{
                        conn = DriverManager.getConnection("jdbc:mariadb://localhost:3306/CS144", "cs144", "");
                        open_stmt = conn.prepareStatement("SELECT title, body FROM Posts WHERE username = ? AND postid = ?");
                        open_stmt.setString(1, username);
                        open_stmt.setInt(2, postid);
                        rs = open_stmt.executeQuery();
                        if (!rs.next())
                        {
                            response.setStatus(404);
                        }
                        else
                        {
                            rs.beforeFirst();
                            while(rs.next()){
                                title = rs.getString("title");
                                body = rs.getString("body");
                            }

                            request.setAttribute("title", title);
                            request.setAttribute("body", body);

                            response.setStatus(200);
                            request.getRequestDispatcher("/edit.jsp").forward(request, response);
                        }
                    }
                    catch (SQLException ex){/* ignored */} 
                    finally{
                        try{ open_stmt.close(); } catch (SQLException ex){/* ignored */}
                        try{ conn.close(); } catch (SQLException ex){/* ignored */}
                        try{ rs.close(); } catch (SQLException ex){/* ignored */}
                    }
                }
            }
            else{
                // ERROR: postid is negative
                response.setStatus(400);
            }               
        }
        else{
            // ERROR: required parameters not included
            response.setStatus(400);
        }
    }

    private void handleList(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException
    {
        if (request.getParameterMap().containsKey("username") != false){        // ensure that username is passed in
            String username = request.getParameter("username").toString();

            Connection conn = null;
            PreparedStatement list_stmt = null;
            ResultSet rs = null;
            try{
                conn = DriverManager.getConnection("jdbc:mariadb://localhost:3306/CS144", "cs144", "");
                list_stmt = conn.prepareStatement("SELECT * FROM Posts WHERE username = ? ORDER BY postid ASC");
                list_stmt.setString(1, username);
                rs = list_stmt.executeQuery();
                if (!rs.next())
                {
                    response.setStatus(404);
                }
                else
                {
                    ArrayList<Integer> postids = new ArrayList<Integer>();
                    ArrayList<String> titles = new ArrayList<String>();
                    ArrayList<String> dates_created = new ArrayList<String>();
                    ArrayList<String> dates_modified = new ArrayList<String>();
                    rs.beforeFirst();
                    while (rs.next()){
                        postids.add(rs.getInt("postid"));
                        titles.add(rs.getString("title"));
                        dates_created.add(rs.getString("created"));
                        dates_modified.add(rs.getString("modified"));
                    }
                    request.setAttribute("username", username);
                    request.setAttribute("postids", postids);
                    request.setAttribute("titles", titles);
                    request.setAttribute("dates_created", dates_created);
                    request.setAttribute("dates_modified", dates_modified);

                    response.setStatus(200);
                    request.getRequestDispatcher("/list.jsp").forward(request, response);
                }
            }
            catch (SQLException ex) {/* ignored */}
            finally{
                try{ list_stmt.close(); } catch (SQLException ex){/* ignored */}
                try{ conn.close(); } catch (SQLException ex){/* ignored */}
                try{ rs.close(); } catch (SQLException ex){/* ignored */}
            }
        }
        else{
            // ERROR: username parameter not included
            response.setStatus(400);
        }
    }

    private void handlePreview(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException
    {
        if (request.getParameterMap().containsKey("username") != false && request.getParameterMap().containsKey("postid") != false &&
            request.getParameterMap().containsKey("title") != false && request.getParameterMap().containsKey("body") != false)
        {
            String username = request.getParameter("username").toString();
            int postid;
            try{
                postid = Integer.parseInt(request.getParameter("postid").toString());
            }
            catch (NumberFormatException ex){
                response.setStatus(400);
                return;
            }
            String title = request.getParameter("title").toString();
            String body = request.getParameter("body").toString();

            Parser parser = Parser.builder().build();
            HtmlRenderer renderer = HtmlRenderer.builder().build();

            String title_compiled = renderer.render(parser.parse(title));
            String body_compiled = renderer.render(parser.parse(body));

            request.setAttribute("username", username);
            request.setAttribute("postid", postid);
            request.setAttribute("title", title);
            request.setAttribute("body", body);
            request.setAttribute("title_compiled", title_compiled);
            request.setAttribute("body_compiled", body_compiled);

            response.setStatus(200);
            request.getRequestDispatcher("/preview.jsp").forward(request, response);
        }
        else{
            // required parameters not provided
            response.setStatus(400);
        }
    }

    private void handleSave(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException
    {
        if (request.getParameterMap().containsKey("username") != false && request.getParameterMap().containsKey("postid") != false &&
            request.getParameterMap().containsKey("title") != false && request.getParameterMap().containsKey("body") != false)
        {
            String username = request.getParameter("username").toString();
            int postid;
            try{
                postid = Integer.parseInt(request.getParameter("postid").toString());
            }
            catch (NumberFormatException ex){
                response.setStatus(400);
                return;
            }
            String title = request.getParameter("title").toString();
            String body = request.getParameter("body").toString();

            Connection conn = null;
            PreparedStatement postid_stmt = null;
            PreparedStatement insert_stmt = null;
            PreparedStatement update_stmt = null;
            ResultSet rs = null;

            Timestamp timestamp1 = new Timestamp(System.currentTimeMillis());
            String timestamp = timestamp1.toString();

            if (postid == 0)
            {
                try{
                    conn = DriverManager.getConnection("jdbc:mariadb://localhost:3306/CS144", "cs144", "");
                    postid_stmt = conn.prepareStatement("SELECT MAX(postid) FROM Posts WHERE username = ?");
                    insert_stmt = conn.prepareStatement("INSERT INTO Posts VALUES(?, ?, ?, ?, ?, ?)");
                    postid_stmt.setString(1, username);
                    rs = postid_stmt.executeQuery();
   
                    int new_postid = 1; 

                    while (rs.next()){
                        String temp = rs.getString("MAX(postid)");
                        if (rs.wasNull()){
                            temp = "0";
                        }
                        new_postid += Integer.parseInt(temp);
                    }

                    insert_stmt.setString(1, username);
                    insert_stmt.setInt(2, new_postid);
                    insert_stmt.setString(3, title);
                    insert_stmt.setString(4, body);
                    insert_stmt.setString(5, timestamp);
                    insert_stmt.setString(6, timestamp);

                    insert_stmt.executeUpdate();
                    response.setStatus(200);

                    PrintWriter out = response.getWriter();
                    out.println("<!DOCTYPE html>");
                    out.println("<html>");
                    out.println("<head>");
                    out.println("<meta http-equiv=\"Refresh\" content=\"0; URL=http://localhost:8888/editor/post?&action=list&username=" + username + " \">");
                    out.println("</head>");
                    out.println("</html>");
                    out.close();
                }
                catch(SQLException ex) {System.err.println("SQLException: " + ex.getMessage());}
                finally{
                    try{ postid_stmt.close(); } catch (SQLException ex){/* ignored */}
                    try{ insert_stmt.close(); } catch (SQLException ex){/* ignored */}
                    try{ conn.close(); } catch (SQLException ex){/* ignored */}
                    try{ rs.close(); } catch (SQLException ex){/* ignored */}
                }
            }
            else if (postid > 0)
            {
                try{
                    conn = DriverManager.getConnection("jdbc:mariadb://localhost:3306/CS144", "cs144", "");
                    update_stmt = conn.prepareStatement("UPDATE Posts SET title = ?, body = ?, modified = ? WHERE username = ? AND postid = ?");

                    update_stmt.setString(1, title);
                    update_stmt.setString(2, body);
                    update_stmt.setString(3, timestamp);
                    update_stmt.setString(4, username);
                    update_stmt.setInt(5, postid);

                    int x = update_stmt.executeUpdate();

                    if (x == 0){
                        response.setStatus(404);
                    }
                    else{
                        response.setStatus(200);
                        PrintWriter out = response.getWriter();
                        out.println("<!DOCTYPE html>");
                        out.println("<html>");
                        out.println("<head>");
                        out.println("<meta http-equiv=\"Refresh\" content=\"0; URL=http://localhost:8888/editor/post?&action=list&username=" + username + " \">");
                        out.println("</head>");
                        out.println("</html>");
                        out.close();
                    }

                }
                catch(SQLException ex) {/* ignored */}
                finally{
                    try{ update_stmt.close(); } catch (SQLException ex){/* ignored */}
                    try{ conn.close(); } catch (SQLException ex){/* ignored */}
                }
            }
            else{
                response.setStatus(400);
            }
        }
        else{
             // required parameters not provided
            response.setStatus(400);
        }
    }

    private void handleDelete(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException
    {
        if (request.getParameterMap().containsKey("username") != false && request.getParameterMap().containsKey("postid") != false)
        {
            String username = request.getParameter("username").toString();
            int postid;
            try{
                postid = Integer.parseInt(request.getParameter("postid").toString());
            }
            catch (NumberFormatException ex){
                response.setStatus(400);
                return;
            }

            Connection conn = null;
            PreparedStatement delete_stmt = null;

            try{
                conn = DriverManager.getConnection("jdbc:mariadb://localhost:3306/CS144", "cs144", "");
                delete_stmt = conn.prepareStatement("DELETE FROM Posts WHERE username = ? AND postid = ?");
                delete_stmt.setString(1, username);
                delete_stmt.setInt(2, postid);

                int x = delete_stmt.executeUpdate();

                if (x == 0){
                    response.setStatus(404);
                }
                else{
                    response.setStatus(200);
                    PrintWriter out = response.getWriter();
                    out.println("<!DOCTYPE html>");
                    out.println("<html>");
                    out.println("<head>");
                    out.println("<meta http-equiv=\"Refresh\" content=\"0; URL=http://localhost:8888/editor/post?&action=list&username=" + username + " \">");
                    out.println("</head>");
                    out.println("</html>");
                    out.close();
                }

            }
            catch(SQLException ex) {/* ignored */}
            finally{
                try{ delete_stmt.close(); } catch (SQLException ex){/* ignored */}
                try{ conn.close(); } catch (SQLException ex){/* ignored */}
            }
        }
        else{
             // required parameters not provided
            response.setStatus(400);
        }
    }
}

