from flask import Blueprint, request, render_template

mod = Blueprint('home', __name__, 
    template_folder='templates',
    static_url_path='/%s' % __name__
)


@mod.route('/')
def home_page():
    return render_template('index.html')