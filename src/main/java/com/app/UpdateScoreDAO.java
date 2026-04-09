package com.app;

import java.sql.*;

public class UpdateScoreDAO {
	
	private static final String MYSQL_URL = "jdbc:mysql://localhost:3306/connectionsdb";
	private static final String DB_USER = "root";
	private static final String DB_PASS = "Tomatoketchup#17";
	
	public void updateScore(String username, int score) throws Exception {
		Class.forName("com.mysql.cj.jdbc.Driver");
		
		try (Connection conn = DriverManager.getConnection(MYSQL_URL, DB_USER, DB_PASS);
				PreparedStatement ps = conn.prepareStatement("UPDATE users SET score = ? WHERE username = ?")) {
			ps.setInt(1, score);
			ps.setString(2, username);
			//ps.executeUpdate();
			
			if (ps.executeUpdate() == 0) {
				System.out.println("score not updated");
			} else { System.out.println("Score updated"); }
		}
	}
}
