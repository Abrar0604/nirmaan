"""
Seed sample transcript data to test the scoring system
This script creates sample transcripts with varying quality levels
"""

import json
from datetime import datetime, timedelta
import uuid

# Sample transcripts with different quality levels
sample_transcripts = [
    {
        "text": "Hello, I am excited to introduce myself. My name is Aarti and I am 14 years old. I study in 9th grade at Delhi Public School. I really enjoy reading books and playing badminton. In my free time, I like to paint and spend time with my family. I feel great to be here today and share a little bit about myself. Thank you for listening.",
        "duration": 35,
        "description": "Excellent transcript with salutation, all keywords, good flow"
    },
    {
        "text": "Hi, my name is Rahul. I am 13 years old and I study in class 8 at St. Mary's School. My hobbies include playing cricket and video games. I enjoy spending time with my friends. Thank you.",
        "duration": 25,
        "description": "Good transcript with most keywords"
    },
    {
        "text": "Um, well, my name is, like, Priya and, uh, I am 15 years old. I go to, you know, Green Valley School. I like, um, reading and, uh, painting. That's basically it.",
        "duration": 20,
        "description": "Poor transcript with many filler words"
    },
    {
        "text": "My name is Amit. I am 12 years old. I study in class 7. I like sports.",
        "duration": 10,
        "description": "Minimal transcript, too brief"
    },
    {
        "text": "Good morning everyone. I am feeling great to introduce myself. My name is Kavya and I am 14 years old. I study in 9th grade at Cambridge International School. I am passionate about science and mathematics. In my free time, I enjoy conducting small experiments at home and reading science fiction novels. I also love playing the piano and have been learning it for the past 5 years. My family is very supportive of my interests and hobbies. I am excited to be part of this wonderful community. Thank you for your time and attention.",
        "duration": 50,
        "description": "Excellent detailed transcript with strong engagement"
    }
]

def create_sample_scores():
    """Create sample scoring data"""
    samples = []
    
    for i, sample in enumerate(sample_transcripts):
        # Create a timestamp going back in time
        timestamp = datetime.now() - timedelta(days=i, hours=i*2)
        
        sample_entry = {
            "transcript_text": sample["text"],
            "duration_seconds": sample["duration"],
            "description": sample["description"],
            "timestamp": timestamp.isoformat()
        }
        
        samples.append(sample_entry)
    
    return samples

if __name__ == "__main__":
    samples = create_sample_scores()
    
    print("Generated Sample Transcripts for Testing")
    print("=" * 50)
    
    for i, sample in enumerate(samples, 1):
        print(f"\nSample {i}:")
        print(f"Description: {sample['description']}")
        print(f"Duration: {sample['duration_seconds']}s")
        print(f"Text preview: {sample['transcript_text'][:80]}...")
        print(f"Timestamp: {sample['timestamp']}")
    
    # Save to file
    output_file = "sample-transcripts.json"
    with open(output_file, 'w') as f:
        json.dump(samples, f, indent=2)
    
    print(f"\n✓ Saved {len(samples)} sample transcripts to {output_file}")
    print("\nYou can use these samples to test the scoring system.")
