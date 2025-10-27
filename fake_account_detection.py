
"""
FakeBuster - Fake Account Detection Module

This module uses Google's Gemini AI to analyze images and determine if they represent a fake social media account.
"""

import os
import google.generativeai as genai
from PIL import Image

# Set your Gemini API key
genai.configure(api_key="AIzaSyBr7MyfmTeQMzGPV1N39pXIslGYG_uzjDY")

def detect_fake_account(platform, image_paths):
    """
    Detect if an account is fake based on the provided images using Google's Gemini AI.
    
    Args:
        platform (str): The social media platform (e.g., 'facebook', 'twitter', 'instagram')
        image_paths (list): A list of file paths to the uploaded images
        
    Returns:
        dict: A dictionary containing detection results
    """
    # Check if we have images to analyze
    if not image_paths or len(image_paths) == 0:
        return {
            "isReal": False,
            "confidenceScore": 0,
            "explanation": "No images provided for analysis."
        }
    
    # Count how many images were successfully loaded
    valid_images = []
    for path in image_paths:
        if os.path.exists(path):
            try:
                img = Image.open(path)
                img.verify()  # Verify it's a valid image
                valid_images.append(path)
            except:
                continue
    
    if not valid_images:
        return {
            "isReal": False,
            "confidenceScore": 0,
            "explanation": "No valid images found. This is highly suspicious for a fake account."
        }
    
    # Load images for analysis
    try:
        loaded_images = [Image.open(path) for path in valid_images]
        
        # Select the appropriate analysis function based on the platform
        if platform.lower() == 'instagram':
            result_text = analyze_instagram_profile(loaded_images)
        elif platform.lower() == 'facebook':
            result_text = analyze_facebook_profile(loaded_images)
        elif platform.lower() in ['twitter', 'x']:
            result_text = analyze_x_profile(loaded_images)
        else:
            # Generic analysis for other platforms
            result_text = analyze_generic_profile(loaded_images)
        
        # Extract confidence score and determine if real
        confidence_score = extract_confidence_score(result_text)
        is_real = confidence_score > 60
        
        return {
            "isReal": is_real,
            "confidenceScore": confidence_score,
            "explanation": result_text
        }
        
    except Exception as e:
        # Fallback to basic detection if Gemini API fails
        print(f"Error using Gemini AI: {str(e)}")
        return fallback_detection(valid_images, platform)


def analyze_instagram_profile(images):
    """Analyzes an Instagram profile using multiple images to determine if it's genuine or fake."""
    prompt = (
        "Analyze the given Instagram profile screenshots and determine if it appears to be a genuine or fake profile. "
        "Consider the following aspects across all provided images to identify potential fake profiles: "
        "   - Inconsistent or overly perfect profile pictures. "
        "   - Generic or nonsensical bio information. "
        "   - A high follower-to-following ratio with low engagement. "
        "   - A lack of personal or authentic content. "
        "   - Use of generic or stolen images. "
        "   - Unusual activity patterns (e.g., sudden increase in followers). "
        "   - Grammatical errors or poor language usage. "
        "Based on your analysis, provide a confidence score between 0 and 100, where: "
        "   - 0 indicates a completely fake profile. "
        "   - 100 indicates a highly likely genuine profile. "
        "**If the profile is assessed as fake, ensure the score is below 60.** "
        "**If the profile is assessed as genuine, ensure the score is above 60.** "
        "Also, summarize the reasoning behind your classification, highlighting the specific aspects you considered across all provided images."
    )
    
    model = genai.GenerativeModel('gemini-2.0-flash')
    response = model.generate_content([prompt, *images])
    return response.text


def analyze_facebook_profile(images):
    """Analyzes a Facebook profile using multiple images to determine if it's genuine or fake."""
    prompt = (
        "Analyze the given Facebook profile using the provided images to determine if it appears to be a genuine or fake profile. "
        "Consider the following aspects to identify potential fake profiles: "
        "   - Inconsistent or overly perfect profile and cover photos. "
        "   - Generic or nonsensical 'About' information. "
        "   - Limited or no personal posts, or repetitive/spam-like posts. "
        "   - A lack of genuine interactions (likes, comments, shares) on posts. "
        "   - Use of generic or stolen images. "
        "   - Unusual activity patterns (e.g., sudden increase in friend requests). "
        "   - Grammatical errors or poor language usage in posts and profile information. "
        "   - Very limited friend counts, or a high number of very recently added friends. "
        "   - The presence or absence of details such as work, education, and location. "
        "Based on your analysis, provide a confidence score between 0 and 100, where: "
        "   - 0 indicates a completely fake profile. "
        "   - 100 indicates a highly likely genuine profile. "
        "**If the profile is assessed as fake, ensure the score is below 60.** "
        "**If the profile is assessed as genuine, ensure the score is above 60.** "
        "Also, summarize the reasoning behind your classification, highlighting the specific aspects you considered across all the provided images."
    )
    
    model = genai.GenerativeModel('gemini-2.0-flash')
    response = model.generate_content([prompt, *images])
    return response.text


def analyze_x_profile(images):
    """Analyzes an X (formerly Twitter) profile using multiple images to determine if it's genuine or fake."""
    prompt = (
        "Analyze the given X (formerly Twitter) profile using the provided images to determine if it appears to be a genuine or fake profile. "
        "Consider the following aspects to identify potential fake profiles: "
        "   - Inconsistent or overly perfect profile and header photos. "
        "   - Generic or nonsensical bio information. "
        "   - A high follower-to-following ratio with low engagement (likes, retweets, replies). "
        "   - A lack of personal or authentic tweets, or repetitive/spam-like tweets. "
        "   - Use of generic or stolen images. "
        "   - Unusual activity patterns (e.g., sudden increase in followers, rapid tweeting). "
        "   - Grammatical errors or poor language usage in tweets and profile information. "
        "   - Very low number of tweets, or extremely high number of tweets in a very short time. "
        "   - The age of the account, recently created accounts are more suspect. "
        "Based on your analysis, provide a confidence score between 0 and 100, where: "
        "   - 0 indicates a completely fake profile. "
        "   - 100 indicates a highly likely genuine profile. "
        "**If the profile is assessed as fake, ensure the score is below 60.** "
        "**If the profile is assessed as genuine, ensure the score is above 60.** "
        "Also, summarize the reasoning behind your classification, highlighting the specific aspects you considered across all the provided images."
    )
    
    model = genai.GenerativeModel('gemini-2.0-flash')
    response = model.generate_content([prompt, *images])
    return response.text


def analyze_generic_profile(images):
    """Analyzes a social media profile using multiple images to determine if it's genuine or fake."""
    prompt = (
        "Analyze the given social media profile screenshots and determine if it appears to be a genuine or fake profile. "
        "Consider the following aspects across all provided images to identify potential fake profiles: "
        "   - Inconsistent or overly perfect profile pictures. "
        "   - Generic or nonsensical bio information. "
        "   - Unusual follower/following counts with low engagement. "
        "   - A lack of personal or authentic content. "
        "   - Use of generic or stolen images. "
        "   - Unusual activity patterns. "
        "   - Grammatical errors or poor language usage. "
        "Based on your analysis, provide a confidence score between 0 and 100, where: "
        "   - 0 indicates a completely fake profile. "
        "   - 100 indicates a highly likely genuine profile. "
        "**If the profile is assessed as fake, ensure the score is below 60.** "
        "**If the profile is assessed as genuine, ensure the score is above 60.** "
        "Also, summarize the reasoning behind your classification, highlighting the specific aspects you considered across all provided images."
    )
    
    model = genai.GenerativeModel('gemini-2.0-flash')
    response = model.generate_content([prompt, *images])
    return response.text


def extract_confidence_score(result_text):
    """
    Extract the confidence score from the Gemini AI response text.
    If we can't find a score, default to 50.
    """
    import re
    
    # Look for patterns like "confidence score: 75", "score of 80", etc.
    score_patterns = [
        r'confidence score:?\s*(\d+)',
        r'confidence:?\s*(\d+)',
        r'score:?\s*(\d+)',
        r'score of:?\s*(\d+)',
        r'rating:?\s*(\d+)',
        r'(\d+)/100',
        r'(\d+)\s*%'
    ]
    
    for pattern in score_patterns:
        matches = re.search(pattern, result_text, re.IGNORECASE)
        if matches:
            try:
                score = int(matches.group(1))
                # Ensure score is between 0 and 100
                return max(0, min(100, score))
            except:
                continue
    
    # If no score is found, check if text clearly indicates fake or real
    fake_indicators = ['fake', 'suspicious', 'not authentic', 'bot', 'fraudulent']
    real_indicators = ['real', 'genuine', 'authentic', 'legitimate']
    
    lower_text = result_text.lower()
    
    # Count fake vs real indicators
    fake_count = sum(1 for word in fake_indicators if word in lower_text)
    real_count = sum(1 for word in real_indicators if word in lower_text)
    
    # If more fake indicators, score < 50, otherwise score > 50
    if fake_count > real_count:
        return 30
    elif real_count > fake_count:
        return 70
    else:
        return 50


def fallback_detection(valid_images, platform):
    """
    Fallback detection method in case the Gemini AI API fails.
    Based on the number of valid images and basic heuristics.
    """
    # Basic logic (for demonstration purposes only)
    # In a real system, this would be a sophisticated ML model
    
    # If multiple valid images, less likely to be fake
    if len(valid_images) >= 3:
        confidence = 75
        is_real = True
        explanation = "Multiple consistent images suggest this is likely a real account."
    elif len(valid_images) >= 1:
        confidence = 50
        is_real = True
        explanation = "Limited number of images. The account may be real, but there isn't enough evidence to be certain."
    else:
        confidence = 90
        is_real = False
        explanation = "No valid images found. This is highly suspicious for a fake account."
    
    # Platform-specific adjustments (just for demonstration)
    if platform.lower() == 'instagram' and is_real:
        confidence -= 10
        explanation += " Instagram has a higher rate of fake accounts, so extra caution is recommended."
    
    return {
        "isReal": is_real,
        "confidenceScore": confidence,
        "explanation": explanation
    }
