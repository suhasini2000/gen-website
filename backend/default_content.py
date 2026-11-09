"""Default site content will be defined here."""
import uuid

AI_TOPICS = ["ChatGPT", "Google Gemini", "Claude", "Microsoft Copilot", "AI Image Generation", "AI Video Creation", "AI Content Creation", "AI Coding Tools", "AI for Business Productivity"]

MAIN = [
    ("AI Tools Training", "AI & Modern Technology",
     "Use ChatGPT, Gemini, Claude, Copilot and other AI tools confidently for study, work and business.",
     "చదువు, ఉద్యోగం, వ్యాపారం కోసం ChatGPT, Gemini, Claude, Copilot వంటి AI టూల్స్‌ను నమ్మకంగా ఉపయోగించడం నేర్చుకోండి.", AI_TOPICS),
    ("Python", "Programming Languages", "Build logic, automation and real-world software with Python.",
     "Python తో లాజిక్, ఆటోమేషన్ మరియు నిజ జీవిత సాఫ్ట్‌వేర్ తయారు చేయడం నేర్చుకోండి.", []),
    ("Java", "Programming Languages", "Learn object-oriented programming and application design with Java.",
     "Java తో ఆబ్జెక్ట్-ఓరియెంటెడ్ ప్రోగ్రామింగ్ మరియు అప్లికేషన్ డిజైన్ నేర్చుకోండి.", []),
    (".NET", "Programming Languages", "Build Windows and web applications with C# and the .NET platform.",
     "C# మరియు .NET ప్లాట్‌ఫామ్‌తో విండోస్ మరియు వెబ్ అప్లికేషన్లు తయారు చేయండి.", []),
    ("Full Stack Development", "Full Stack & Web Development", "Create complete websites and apps — from interface to database.",
     "ఇంటర్‌ఫేస్ నుండి డేటాబేస్ వరకు పూర్తి వెబ్‌సైట్లు మరియు యాప్‌లు తయారు చేయండి.", []),
    ("C / C++", "Programming Languages", "Strong programming foundations with C and C++.",
     "C మరియు C++ తో బలమైన ప్రోగ్రామింగ్ పునాది వేసుకోండి.", []),
    ("MS Office", "Office & Business Applications", "Master Word, Excel and PowerPoint for everyday work.",
     "రోజువారీ పనుల కోసం Word, Excel, PowerPoint లో నైపుణ్యం సాధించండి.", []),
    ("Tally with GST", "Office & Business Applications", "Learn accounting and GST workflows used by real businesses.",
     "వ్యాపారాల్లో ఉపయోగించే అకౌంటింగ్ మరియు GST పనులు నేర్చుకోండి.", []),
    ("AutoCAD", "Graphic Design & Engineering", "Create precise 2D and 3D engineering drawings.",
     "ఖచ్చితమైన 2D మరియు 3D ఇంజనీరింగ్ డ్రాయింగ్‌లు తయారు చేయండి.", []),
]

MORE = [
    ("Programming Languages", ["Advanced Java"]),
    ("Full Stack & Web Development", ["HTML", "CSS", "JavaScript", "React.js", "Next.js", "Python Full Stack Development", "Java Full Stack Development", ".NET Full Stack Development", "Django", "Git and GitHub"]),
    ("AI & Modern Technology", ["Artificial Intelligence Fundamentals", "ChatGPT", "Google Gemini", "Claude", "Microsoft Copilot", "AI for Content Creation", "AI Image Generation", "AI Video Creation", "AI Coding Tools", "GitHub Copilot", "Practical AI Applications"]),
    ("Database & Other Technologies", ["SQL Server", "Oracle", "MySQL", "Unix"]),
    ("Office & Business Applications", ["MS Word", "MS Excel", "MS PowerPoint"]),
    ("Graphic Design & Engineering", ["Adobe Photoshop", "PageMaker"]),
    ("Kids Programming", ["Scratch Programming", "Basic Computer Skills", "Logical Thinking and Problem Solving", "Introduction to AI for Kids"]),
    ("Vedic Mathematics", ["Vedic Maths Foundation", "Vedic Maths for School Students", "Fast Calculation Techniques", "Mental Mathematics", "Vedic Maths for Competitive Exam Preparation"]),
]

GENERIC_EN = "Build practical understanding through guided lessons, exercises and projects tailored to your level."
GENERIC_TE = "మీ స్థాయికి తగిన పాఠాలు, అభ్యాసాలు మరియు ప్రాజెక్టులతో ఆచరణాత్మక జ్ఞానం పొందండి."


def _course(name, category, en, te, topics, featured):
    return {"id": str(uuid.uuid4()), "name": name, "category": category, "description": en, "description_te": te,
            "duration": "", "topics": topics, "featured": featured}


def default_courses() -> list[dict]:
    main = [_course(n, c, en, te, t, True) for n, c, en, te, t in MAIN]
    more = [_course(n, c, GENERIC_EN, GENERIC_TE, [], False) for c, names in MORE for n in names]
    return main + more


def default_social_links() -> list[dict]:
    links = [
        ("youtube", "GenInfo Computer Education Centre", "https://youtube.com/@geninfocomputereducationcentre"),
        ("youtube", "MathSpark@26", "https://youtube.com/@mathspark26-g2h"),
        ("instagram", "@geninfotech_official", "https://www.instagram.com/geninfotech_official"),
        ("instagram", "@mathspark26", "https://www.instagram.com/mathspark26"),
    ]
    return [{"id": str(uuid.uuid4()), "platform": p, "label": label, "url": url} for p, label, url in links]


def default_reviews() -> dict:
    return {"youtube_videos": ["https://youtu.be/NplVw3DcuCM", "https://youtu.be/EzJCs3qoCRk"], "google_reviews_url": "", "instagram_reel_url": ""}
