<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.ArrayList" %><%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %><!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="list_style.css">
    <title>Post List</title>
</head>
<body>
    <div>
        <form action="post" id="0" method="POST">
            <input type="hidden" name="username" value="<%= request.getAttribute("username") %>">
            <input type="hidden" name="postid" value="0">
            <button type="submit" name="action" value="open">New Post</button>
        </form>
    </div>
    <table>
        <tbody>
            <tr><th>Title</th><th>Created</th><th>Modified</th><th>&nbsp;</th></tr>
            <%  ArrayList<Integer> postids = (ArrayList<Integer>)request.getAttribute("postids");
                ArrayList<String> titles = (ArrayList<String>)request.getAttribute("titles"); 
                ArrayList<String> created = (ArrayList<String>)request.getAttribute("dates_created");
                ArrayList<String> modified = (ArrayList<String>)request.getAttribute("dates_modified");
                for (int i=0; i < postids.size(); i++) { %>
                    <tr>
                        <form id="<%= i + 1 %>" action="post" method="POST">
                        <input type="hidden" name="username" value="<%= request.getAttribute("username") %>">
                        <input type="hidden" name="postid" value="<%= postids.get(i) %>">
                        <td><%= titles.get(i) %></td>
                        <td><%= created.get(i) %></td>
                        <td><%= modified.get(i) %></td>
                        <td>
                            <button type="submit" name="action" value="open">Open</button>
                            <button type="submit" name="action" value="delete">Delete</button>
                        </td>
                        </form>
                    </tr>
            <%  } %>
        </tbody>
    </table>
</body>
</html>