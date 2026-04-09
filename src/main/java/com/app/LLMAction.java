package com.app;

import java.net.*;
import java.net.http.*;
import java.util.List;

import org.json.JSONObject;
import org.json.JSONArray;

import redis.clients.jedis.Jedis;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.opensymphony.xwork2.ActionSupport;

public class LLMAction extends ActionSupport{
	
	private String message = "Create 6 categories similar to a NYT Connections-style puzzle. "
			+ "Each category must have exactly 6 members. Categories should have different themes and do not use generic themes. "
			+ "Members of each category should be strictly unique and a word or phrase should not appear more than once in a category. "
			+ "All members must factually and correctly belong to that category, double check before including a member in the category. "
			+ "The Categories should have increasing difficulty to find."
			+ "Include a hex color for each category. Assign color like this in this order for increasing difficulty: '#f9df6d','#a0c35a', '#b0c4ef', '#ba81c5', '#8fd3d1', '#ff9f68'. "
			+ "Return valid JSON in this format: [ {'title': 'CATEGORY NAME','members': ['WORD1', 'WORD2', 'WORD3', 'WORD4', 'WORD5', 'WORD6'],'color': '#HEXCOLOR'}]";
	
	private String llmResponse;
	private List<Items> items;
	private int order;
	
	private ObjectMapper mapper = new ObjectMapper();
	private ConstructItems construct = new ConstructItems();
	
	public String execute() {
		try (Jedis jedis = new Jedis("localhost", 6379)) {
			llmResponse = jedis.get("categories");
			if (llmResponse != null) {
				try {
					List<Group> group = construct.buildGroups(llmResponse, order);
					jedis.setex("currentGroups", 1800, mapper.writeValueAsString(group));
					items = construct.buildItems(group);
					return SUCCESS;
				}
				catch(Exception e) {
					e.printStackTrace();
					System.out.println("");
				}
			} else {
				try {
					String requestBody = "{"
							+ "\"messages\": [{\"role\": \"user\", \n" + "\"content\": \"" + message + "\"}]" + "}";
					
					HttpRequest request = HttpRequest.newBuilder().uri(URI.create("http://infinity-sm3.csez.zohocorpin.com:8098/m4/v2/chat"))
			                .header("Content-Type", "application/json").POST(HttpRequest.BodyPublishers.ofString(requestBody)).build();
					
					HttpClient client = HttpClient.newHttpClient();
					HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
					
					//System.out.println(response.statusCode()); 
					
					JSONObject jsonResponse = new JSONObject(response.body());
					JSONArray choices = jsonResponse.getJSONArray("choices");
					JSONObject firstChoice = choices.getJSONObject(0);
					llmResponse = firstChoice.getJSONObject("message").getString("content");
					//System.out.println("Inserted and fetched from cache");
					
					jedis.setex("categories", 1800, llmResponse);
					
					try {
						List<Group> group = construct.buildGroups(llmResponse, order);
						jedis.setex("currentGroups", 1800, mapper.writeValueAsString(group));
						items = construct.buildItems(group);
						return SUCCESS;
					}
					catch(Exception e) {
						e.printStackTrace();
						System.out.println("");
					}
					
					
				} catch(Exception e) {
					llmResponse = "Error calling LLM API";
		            e.printStackTrace();
				}
			}
		}
		return ERROR;
	}

	public String getLlmResponse() {
		return llmResponse;
	}

	public int getOrder() {
		return order;
	}

	public void setOrder(int order) {
		this.order = order;
	}

	public List<Items> getItems() {
		return items;
	}

	public void setItems(List<Items> items) {
		this.items = items;
	}

}
