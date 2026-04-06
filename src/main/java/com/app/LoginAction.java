package com.app;

import com.opensymphony.xwork2.ActionSupport;

public class LoginAction extends ActionSupport {
	
    private String username;
    private User user;
    private LoginDAO userDao = new LoginDAO();

    public String execute() {
        try {
        	//System.out.println("Received : "+ username);
            user = userDao.getUser(username);
            //System.out.println(user.getUsername());
            //System.out.println(user.getScore());
            return SUCCESS;
        } catch (Exception e) {
            addActionError("Error: " + e.getMessage());
            return ERROR;
        }
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public User getUser() { return user; }
    
}
