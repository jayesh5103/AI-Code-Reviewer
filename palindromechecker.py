def is_palindrome(text):
    return text.lower().replace(" ", "") == text.lower().replace(" ", "")[::-1]
    