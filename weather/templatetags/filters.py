from django import template


register = template.Library()


@register.filter
def mul(lhs, rhs):
    return lhs * rhs
