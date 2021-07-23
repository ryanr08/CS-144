<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%><%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %><!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="preview_style.css">
        <title>Preview Post</title>
    </head>
    <body>
        <div>
            <form action="post" method="POST">
                <input type="hidden" name="username" value="<%= request.getAttribute("username") %>">
                <input type="hidden" name="postid" value="<%= request.getAttribute("postid") %>">
                <input type="hidden" name="title" value="<%= request.getAttribute("title") %>">
                <input type="hidden" name="body" value="<%= request.getAttribute("body") %>">
                <button type="submit" name="action" value="open">Close Preview</button>
            </form>
        </div>
        <div>
            <h1 id="title"><%= request.getAttribute("title_compiled") %></h1>
            <div if="body"><%= request.getAttribute("body_compiled") %></div>
        </div>
    </body>
</html>