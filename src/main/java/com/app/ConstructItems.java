package com.app;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.ObjectMapper;

public class ConstructItems {
	
	private ObjectMapper mapper = new ObjectMapper();
	
	private <T> List<T> shuffle(List<T> groups) {
		List<T> shuffledList = new ArrayList<T>(groups);
		Collections.shuffle(shuffledList);
		return shuffledList;
	}
	
	public List<Group> buildGroups(String response, int order) throws Exception {
		
		List<Group> groups = Arrays.asList(mapper.readValue(response, Group[].class));
		List<Group> newGroups = shuffle(groups).stream().limit(order).collect(Collectors.toList());
		
		List<Group> finalGroups = new ArrayList<>();
		
		for (Group group : newGroups) {
			Group g = new Group();
			g.setTitle(group.getTitle());
			g.setColor(group.getColor());
			g.setMembers(shuffle(group.getMembers()).stream().limit(order).collect(Collectors.toList()));
			finalGroups.add(g);
		}
		
		return finalGroups;
	}
	
	public List<Items> buildItems(List<Group> groups) {
			
			List<Items> items = new ArrayList<>();
			
			for (Group group : groups) {
				int groupIndex = groups.indexOf(group);
				group.getMembers().forEach(member -> { 
					Items item = new Items();
					int memberIndex = group.getMembers().indexOf(member);
					item.setId(groupIndex * group.getMembers().size() + memberIndex);
					item.setValue(member);
					item.setColor(group.getColor());
					
					items.add(item);
				});
			}
			
			return shuffle(items);
		
	}
}
