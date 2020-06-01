from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.http import Http404
from django.urls import reverse
from django.conf import settings


import re, string, random

def paginate(query_set, paginate_by, page):
	paginator = Paginator(query_set, paginate_by)
	try:
		p = paginator.page(page)
		return {
			'data': p.object_list.all(),
			'has_next': p.has_next(),
		}
	except (EmptyPage,PageNotAnInteger):
		return {
			'data': [],
			'has_next': False,
		}


class PaginatorByLatest:

	class LatestDoesNotExist(Exception):
		pass

	def __init__(self, query_set, paginate_by, latest_pk, order_by):
		self.query_set = query_set
		self.paginate_by = paginate_by
		self.is_desc = order_by[0] == '-'
		self.order_by = order_by[1:] if self.is_desc else order_by
		self.latest = self.determinLatest(latest_pk)
		self.data, self.has_next = self.paginate(latest_pk)

	def determinLatest(self, latest_pk):
		if latest_pk:
			latest = self.query_set.filter(pk=latest_pk)
			if latest.exists():
				return latest.values_list(self.order_by)[0][0]
			else:
				raise LatestDoesNotExist('Object with latest_pk doesn\'t exist !')
		return None

	def paginate(self, latest_pk):
		if self.latest:
			data = self.query_set.filter( self.getQuery() )[0:self.paginate_by+1]
		else:
			data = self.query_set[0:self.paginate_by+1]

		return (
			# paginated qquery set
			data[:self.paginate_by],
			# has next
			data.count() > self.paginate_by
		)

	def getQuery(self):
		if self.is_desc:
			return Q(**{f"{self.order_by}__lt": self.latest})
		else:
			return Q(**{f"{self.order_by}__gt": self.latest})

def dictHas(dict, keys):
    """ Verify if dict has expected keys"""
    for i in keys:
        if dict.get(i) is None:
            return False
    return True

def dictHasExact(dict, keys):
    """ Verify if dict has exactly what expected """
    if len(dict) != len(keys):
        return False
    for i in keys:
        if dict.get(i) is None:
            return False
    return True

def dictRemove(dict, keys):
    """ Remove dict values who has a key in  keys"""
    for key in keys:
        dict.pop(key)
    return dict

def dictGet(dict, keys):
    """ Get dict values who has a key in keys"""
    new_dict = {}
    for key in keys:
        new_dict.setdefault(key, dict.get(key))
    return  new_dict

def validatePassword(password):
    return (8 <= len(password) <= 128) and ( ' ' not in password)

def generateKey():
	str_  = string.digits + string.ascii_letters
	return ''.join(random.SystemRandom().choice(str_) for _ in range(30))

class Validators:

	def password(value):
		if not value:
			return "This field is required."
		if not (min <= len(value) <= max) or (' ' in value):
			return "Password must contain at least 8 characters without spaces."
		return None

	def maxMinLength(value, max, min):
		if not value:
			return "This field is required."
		if not (min <= len(value) <= max):
			return f"This field can only contain between {min} and {max} characters."
		return None

	def exactLength(value, length):
		if not value:
			return "This field is required."
		if len(value) != length:
			return f"This field can only contain {length} characters."

	def username(value):
		if not value:
			return "This field is required."
		if not re.match("^\w{6,15}$", value):
			return "Username  must contain at least 6 characters"

	def maxMinNumber(value, max, min):
		if not value:
			return "This field is required."
		if not (min <= value <= max):
			return f"This field can only contain a number between {min} and {max}."
		return None

def UserActivationMailContent(full_name, key):
	activation_link = reverse('activate-user', args=[key])
	return (
		f"<h1>Hi {full_name} !</h1>"+
		f"<b>Please open the link below to activate your account:</b><br>"+
		f"<a href=\"{settings.HOST}{activation_link}\" >Activate my account</a>"
	)

def UserResetMailContent(full_name, key):
	reset_link = reverse('user-reset-update', args=[key])
	return (
		f"<h1>Hi {full_name} !</h1>"+
		f"<b>Please open the link below to reset your account:</b><br>"+
		f"<a href=\"{settings.HOST}{reset_link}\" >Reset my account</a>"
	)
