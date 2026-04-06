package com.app;

import java.util.List;
import com.opensymphony.xwork2.ActionSupport;

public class LeaderboardAction extends ActionSupport {
	private List<User> leaderboard;
	private LeaderboardDAO leaderboardDao = new LeaderboardDAO();
	
	public String execute() {
		try {
			leaderboard = leaderboardDao.fetchLeaderboard();
			
			//System.out.println("Leaderboard from Action class");
			//leaderboard.forEach(u -> System.out.println(u.getUsername() + " " + u.getScore()));
			
			return SUCCESS;
		} catch(Exception e) {
			e.printStackTrace();
			System.out.println("Failed to fetch in Action class : " + e);
		}
		
		return ERROR;
	}
	
	public List<User> getLeaderboard() { return leaderboard; }
}
