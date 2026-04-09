package com.app;

import java.util.Arrays;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.opensymphony.xwork2.ActionSupport;
import redis.clients.jedis.Jedis;

public class RevealGroups extends ActionSupport {
	private List<Group> groups;
	
	public String execute() throws Exception {
		
		ObjectMapper mapper = new ObjectMapper();
		
		try (Jedis jedis = new Jedis("localhost", 6379)) {
			String cached = jedis.get("currentGroups");
			groups = Arrays.asList(mapper.readValue(cached, Group[].class));
			
			groups.forEach(g -> System.out.println(g.getTitle()));
			
			return SUCCESS;
		}
		catch (Exception e) {
			e.printStackTrace();
			return ERROR;
		}
	}

	public List<Group> getGroups() {
		return groups;
	}

	public void setGroups(List<Group> groups) {
		this.groups = groups;
	}
}
