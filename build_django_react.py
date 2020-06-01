""" Get a react build apps files and move them to django app clearly """
import os, shutil

# configs

STATIC_DIR_PATH = "static"
TEMPLATES_DIR_PATH = "templates"
REACT_APPS_DIR_PATH = "front-end-pages"
TEMPLATE_NAME = "index.html"
STATIC_DIRS = [
    'js',
    'css',
    'media'
]

# end configs

def createBasicDirs():
    for dir in STATIC_DIRS:
        try:
            os.mkdir(os.path.join(STATIC_DIR_PATH, dir))
        except FileExistsError:
            pass

def copyReactAppsToDjango():
    # get apps folder
    react_apps = [ path for path in  os.listdir(REACT_APPS_DIR_PATH) if os.path.isdir(os.path.join(REACT_APPS_DIR_PATH, path))]
    # copy each app to django
    for app in react_apps:
        build_path = os.path.join(REACT_APPS_DIR_PATH, app, 'build')
        if not os.path.exists(build_path):
            raise Exception(
                "\n Build dir doesn't exists"+
                "\n You should run npm run build first !"+
                f"\n App name: {app}"+
                f"\n Build dir path: {build_path}"

            )
        build_static_path = os.path.join(build_path, 'static')
        # copy files
        # template index.html
        shutil.copyfile(
            os.path.join(build_path, TEMPLATE_NAME),
            os.path.join(TEMPLATES_DIR_PATH, f"{app}.html")
        )
        # static (js, css, media)
        for dir in STATIC_DIRS:
            dir_path = os.path.join(build_static_path, dir)
            django_static_path = os.path.join(STATIC_DIR_PATH, dir)
            files = os.listdir(dir_path)
            for file in files:
                shutil.copyfile(
                    os.path.join(dir_path, file),
                    os.path.join(django_static_path, file)
                )

def main():
    createBasicDirs()
    copyReactAppsToDjango()

if __name__ == "__main__":
    main()
