package com.app;

import com.opensymphony.xwork2.ActionSupport;

public class UpdateScoreAction extends ActionSupport {
	private String username;
	private int score;
	private UpdateScoreDAO updateScoreDao = new UpdateScoreDAO();
	
	public String execute() {
		try {
			updateScoreDao.updateScore(username, score);
			return SUCCESS;
		} catch(Exception e) {
			e.printStackTrace();
			return ERROR;
		}
	}
	
	public String getUsername() { return username; }
	public void setUsername(String username) { this.username = username; }
	
	public int getScore() { return score; }
	public void setScore(int score) { this.score = score; }
	
}
