package com.app;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class LeaderboardDAO {
	private static String MYSQL_URL = "jdbc:mysql://localhost:3306/connectionsdb";
	private static String DB_USER = "root";
	private static String DB_PASS = "Tomatoketchup#17";
	
	public List<User> fetchLeaderboard() throws Exception {
		
		List<User> userList = new ArrayList<User>();
		
		Class.forName("com.mysql.cj.jdbc.Driver");
		
		try (Connection conn = DriverManager.getConnection(MYSQL_URL, DB_USER, DB_PASS)){
			
			PreparedStatement ps = conn.prepareStatement("Select username, score from users Order by score DESC");
			ResultSet rs = ps.executeQuery();
			
			while (rs.next()) {
				User user = new User();
				user.setUsername(rs.getString("username"));
				user.setScore(rs.getInt("score"));
				userList.add(user);
			}
		} catch(Exception e) {
			e.printStackTrace();
			System.out.println("Failed to fetch users : " + e);
		}
		
		return userList;
	}

}
