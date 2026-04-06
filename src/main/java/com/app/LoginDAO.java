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
		String key = "user:" + username;
		
		/*JedisPoolConfig poolConfig = new JedisPoolConfig();
		poolConfig.setMaxTotal(20);
		
		JedisPool jedisPool = new JedisPool(poolConfig, "localhost", 6379);
		
		try (Jedis jedis = jedisPool.getResource()) {
			String cached = jedis.get(key);
			if (cached != null) {
				return mapper.readValue(cached, User.class);
			}
		}*/
		
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
                System.out.println("Fetched from DB");
			} else {
				PreparedStatement ps1 = conn.prepareStatement("INSERT INTO users(username, score) VALUES(?, ?)");
				ps1.setString(1, username);
				ps1.setInt(2, 0);
				
				ps1.executeUpdate();
				user = new User();
				user.setUsername(username);
				user.setScore(0);
				System.out.println("Inserted and fetched from db");
			}
		}
		
		/*if (user != null) {
			try (Jedis jedis = jedisPool.getResource()) {
                jedis.setex(key, 60, mapper.writeValueAsString(user));
            } catch(Exception e) {
            	System.out.println("Error : " + e.getMessage());
            }
		}
		
		jedisPool.close();*/
		
		return user;
	}

}
