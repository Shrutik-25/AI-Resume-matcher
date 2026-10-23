from typing import List, Dict, Set

def calculate_weighted_score(
    candidate_skills: List[str], 
    required_skills: List[str], 
    optional_skills: List[str] = None
) -> Dict:
    """
    Calculates a weighted fit score between candidate skills and job requirements.
    - Required skills carry a higher weight (weight = 2.0)
    - Optional/Bonus skills carry standard weight (weight = 1.0)
    """
    if optional_skills is None:
        optional_skills = []

    # Normalize all skills to lowercase for accurate comparison
    cand_set: Set[str] = {s.lower().strip() for s in candidate_skills}
    req_set: Set[str] = {s.lower().strip() for s in required_skills}
    opt_set: Set[str] = {s.lower().strip() for s in optional_skills}

    req_weight = 2.0
    opt_weight = 1.0

    total_possible_weight = (len(req_set) * req_weight) + (len(opt_set) * opt_weight)
    
    if total_possible_weight == 0:
        return {
            "matchScore": 0,
            "matchingSkills": [],
            "missingSkills": list(required_skills)
        }

    earned_weight = 0.0
    matching_skills = []
    missing_skills = []

    # Evaluate required skills
    for skill in required_skills:
        s_clean = skill.lower().strip()
        if s_clean in cand_set:
            earned_weight += req_weight
            matching_skills.append(skill)
        else:
            missing_skills.append(skill)

    # Evaluate optional skills
    for skill in optional_skills:
        s_clean = skill.lower().strip()
        if s_clean in cand_set:
            earned_weight += opt_weight
            if skill not in matching_skills:
                matching_skills.append(skill)

    # Calculate final weighted percentage
    final_score = round((earned_weight / total_possible_weight) * 100, 1)

    return {
        "matchScore": min(final_score, 100.0),
        "matchingSkills": matching_skills,
        "missingSkills": missing_skills
    }