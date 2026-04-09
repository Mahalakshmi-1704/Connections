package com.app;

import com.opensymphony.xwork2.ActionSupport;

public class LoginAction extends ActionSupport {
	
    private String username;
    private User user;
    private LoginDAO userDao = new LoginDAO();

    public String execute() {
        try {
            user = userDao.getUser(username);
            
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
