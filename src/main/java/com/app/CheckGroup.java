package com.app;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.opensymphony.xwork2.ActionSupport;

import redis.clients.jedis.Jedis;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

public class CheckGroup extends ActionSupport {
	private List<String> selectedList;
	private boolean isCorrect = false;
	private boolean oneAway = false;
	private Group group;
	
	private ObjectMapper mapper = new ObjectMapper();
	
	public String checkGroup() {
		try(Jedis jedis = new Jedis("localhost", 6379)) {
			
			//selectedList.forEach(l -> System.out.println(l));
			
			String cached = jedis.get("currentGroups");
			List<Group> groups = Arrays.asList(mapper.readValue(cached, Group[].class));
			
			for (Group group: groups) {
				if (new HashSet<>(group.getMembers()).equals(new HashSet<>(selectedList))) {
					isCorrect = true;
					this.group = group;
					break;
				}
				int count = 0;
				for (String member : selectedList) {
					if (group.getMembers().contains(member)) {
						count++;
					}
				}
				
				if (count == selectedList.size() - 1) { oneAway = true; }
			}
			
			
			return SUCCESS;
		} catch (Exception e) {
			e.printStackTrace();
			return ERROR;
		}
		
	}
	
	public List<String> getSelectedList() { return this.selectedList; }
	public void setSelectedList(List<String> selectedList) { this.selectedList = selectedList; }
	public boolean getIsCorrect() { return this.isCorrect; }
	public boolean getOneAway() { return this.oneAway; }

	public Group getGroup() {
		return group;
	}

	public void setGroup(Group group) {
		this.group = group;
	}
	
}

