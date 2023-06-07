from django import template
import functools
register = template.Library()

#recibe el username de un usuario y una lista de usuarios
@register.filter(name='findUser')
def findUser(username, list):
    result = map(lambda u: u.id, list)
    return username in result

@register.filter(name='get_first_char')
def get_first_char(value):
  return value[0].upper()
  
@register.filter(name='to_int')
def to_int(value):
    return int(value)


@register.filter(name='format')
def format(value, fmt):
    return fmt.format(value)
# @register.filter(name='upper')
# def upper(value):
#   return value.upper()