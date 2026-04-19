# from flask import Flask, request, jsonify
# import time

# app = Flask(__name__)

# # In-memory activity tracker

# user_activity = {}

# def calculate_risk(user, action, ip):
#     now = time.time()


#     # Initialize user history
#     if user not in user_activity:
#         user_activity[user] = []

#     # Record activity timestamp
#     user_activity[user].append(now)
#     # After filtering timestamps
#     print("User activity:", user, len(user_activity[user]))


#     # Keep only last 60 seconds of activity
#     user_activity[user] = [
#         t for t in user_activity[user]
#         if now - t < 60
#     ]

#     rate = len(user_activity[user]) / 60

#     if rate > 0.2:
#         return 0.9, "High activity rate"

#     # Rule 1: Too many rapid actions
#     if len(user_activity[user]) > 3:
#         return 0.9, "Suspicious rapid activity"
    
    


#     # Rule 2: Localhost activity (low risk example)
#     if ip.startswith("127.") or ip.startswith("0:0:0"):
#         return 0.3, "Localhost activity"

#     # Default normal behavior
#     return 0.1, "Normal behavior"


# @app.route("/analyze", methods=["POST"])
# def analyze():
#     data = request.get_json()

#     user = data.get("user")
#     action = data.get("action")
#     ip = data.get("ip")

#     score, reason = calculate_risk(user, action, ip)

#     return jsonify({
#         "risk_score": score,
#         "reason": reason,
#         "block": score > 0.8
#     })


# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5001, debug=True)

from flask import Flask, request, jsonify
import time

app = Flask(__name__)

# Memory stores

user_activity = {}
login_failures = {}
user_ips = {}

def clean_old(entries, window):
    now = time.time()
    return [t for t in entries if now - t < window]

def calculate_risk(user, action, ip):
    now = time.time()

    # Initialize stores
    user_activity.setdefault(user, [])
    login_failures.setdefault(user, [])
    user_ips.setdefault(user, set())

    # Track general activity
    user_activity[user].append(now)
    user_activity[user] = clean_old(user_activity[user], 60)

    # Track login failures
    if action == "LOGIN_FAIL":
        login_failures[user].append(now)

    login_failures[user] = clean_old(login_failures[user], 30)

    # Track IP switching
    user_ips[user].add(ip)

    # ---------- Detection Rules ----------

    # Rapid activity
    if len(user_activity[user]) > 10:
        return 0.9, "Rapid activity spike"

    # Brute force login
    if len(login_failures[user]) > 5:
        return 1.0, "Brute force login attempt"

    # File exfiltration
    if action == "DOWNLOAD" and len(user_activity[user]) > 8:
        return 0.85, "Possible data exfiltration"

    # IP switching
    if len(user_ips[user]) > 3:
        return 0.8, "Multiple IP access detected"

    # Default
    return 0.1, "Normal behavior"


@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()

    user = data.get("user")
    action = data.get("action")
    ip = data.get("ip")

    score, reason = calculate_risk(user, action, ip)

    return jsonify({
        "risk_score": score,
        "reason": reason,
        "block": score > 0.8
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=False)

