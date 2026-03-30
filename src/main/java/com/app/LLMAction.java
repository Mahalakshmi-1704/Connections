package com.app;

import java.net.*;
import java.net.http.*;
import org.json.JSONObject;
import org.json.JSONArray;

import com.opensymphony.xwork2.ActionSupport;

public class LLMAction extends ActionSupport{
	
	private String message = "Create 6 categories similar to a NYT Connections-style puzzle. Each category must have exactly 6 members. Categories should have different themes. Members of each category should be strictly unique. The Categories should have increasing difficulty to find. Make some groups obvious and some tricky. Include a hex color for each category. Assign color like this in this order for increasing difficulty: '#f9df6d','#a0c35a', '#b0c4ef', '#ba81c5', '#8fd3d1', '#ff9f68'.Return valid JSON in this format: [ {'title': 'CATEGORY NAME','members': ['WORD1', 'WORD2', 'WORD3', 'WORD4', 'WORD5', 'WORD6'],'color': '#HEXCOLOR'}]";
	private String llmResponse;
	
	public String ask() {
		
		try {
			String requestBody = "{"
					+ "\"messages\": [{\"role\": \"user\", \n" + "\"content\": \"" + message + "\"}]" + "}";
			
			HttpRequest request = HttpRequest.newBuilder().uri(URI.create("http://infinity-sm3.csez.zohocorpin.com:8098/m4/v2/chat"))
	                .header("Content-Type", "application/json").POST(HttpRequest.BodyPublishers.ofString(requestBody)).build();
			
			HttpClient client = HttpClient.newHttpClient();
			HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
			
			System.out.println(response.statusCode());
			//System.out.println(response.body());  
			
			JSONObject jsonResponse = new JSONObject(response.body());
			JSONArray choices = jsonResponse.getJSONArray("choices");
			JSONObject firstChoice = choices.getJSONObject(0);
			llmResponse = firstChoice.getJSONObject("message").getString("content");
			
		} catch(Exception e) {
			llmResponse = "Error calling LLM API";
            e.printStackTrace();
		}
		
		return SUCCESS;
	}

	public String getLlmResponse() {
		return llmResponse;
	}
}
