package com.app;

import com.fasterxml.jackson.databind.ObjectMapper;
/*import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;*/

import java.sql.*;

public class LoginDAO {
	
	private static final String MYSQL_URL = "jdbc:mysql://localhost:3306/connectionsdb";
	private static final String DB_USER = "root";
	private static final String DB_PASS = "Tomatoketchup#17";
	private ObjectMapper mapper = new ObjectMapper();
	
	public User getUser(String username) throws Exception {
		User user = null;
		Class.forName("com.mysql.cj.jdbc.Driver");
		
		try (Connection conn = DriverManager.getConnection(MYSQL_URL, DB_USER, DB_PASS);
	             PreparedStatement ps = conn.prepareStatement(
	                     "SELECT * FROM users WHERE username = ?")) {
			
			ps.setString(1, username);
			ResultSet rs = ps.executeQuery();
			
			if (rs.next()) {
				user = new User();
                user.setUsername(rs.getString("username"));
                user.setScore(rs.getInt("score"));
			} else {
				PreparedStatement ps1 = conn.prepareStatement("INSERT INTO users(username, score) VALUES(?, ?)");
				ps1.setString(1, username);
				ps1.setInt(2, 0);
				
				ps1.executeUpdate();
				user = new User();
				user.setUsername(username);
				user.setScore(0);
			}
		}
		
		return user;
	}

}
