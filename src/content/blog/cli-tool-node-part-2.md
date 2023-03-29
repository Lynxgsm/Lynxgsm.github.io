---
title: "Create a CLI tool to help bootstraping Flutter project using Node.JS - Part 2"
description: ""
pubDate: "12 Mar 2023"
heroImage: "/placeholder-hero.jpg"
author: "Lynxgsm"
draft: true
---

## What we've done so far

In the [first part](https://dev.to/lynxgsm/create-a-cli-tool-to-help-bootstraping-flutter-project-using-nodejs-part-1-7cp) of the article, we've:

- created a cli node project
- interact with user about the application informations
- create a project using these informations
- create folder structure along with it

Now that we've got our folder structure, in this article, we will add the files according what we want to add by default and implement the module creation part.

Here are the utility files that we want to add:

- `app.dart`: entry point of our app
- `transitions.dart`: helps us to add a custom animation for page transitions
- `navigation.dart`: contains a function to change page using our custom animation
- `spacing.dart`: contains some functions to help us deal with spacing

We will also change the `main.dart` to match the adding of the `app.dart`

## Template contents

Let's create a folder where we will hold our template files. Of course, i named mine _templates_ (how original! 😱) and create our files.

Let's start by creating the `spacing.dart` and paste this:

```dart
import 'package:flutter/material.dart';

SizedBox space({double? width, double? height}) {
  return SizedBox(
    width: width ?? 0,
    height: height ?? 0,
  );
}

double width(BuildContext context) {
  return MediaQuery.of(context).size.width;
}

double height(BuildContext context) {
  return MediaQuery.of(context).size.height;
}

```

As you can see, it's just a bunch of functions like for example **space** which will help me set a space where i want.

Now, let's add the `transitions.dart` which will use the _animations_ module:

```dart
import 'package:animations/animations.dart';
import 'package:flutter/material.dart';

class Transitions {
  static Route sharedAxisPageTransition(Widget screen,
      {bool isHorizontal = true}) {
    final SharedAxisTransitionType _transitionType = isHorizontal
        ? SharedAxisTransitionType.horizontal
        : SharedAxisTransitionType.vertical;

    return PageRouteBuilder<SharedAxisTransition>(
        pageBuilder: (context, animation, secondaryAnimation) => screen,
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return SharedAxisTransition(
            animation: animation,
            secondaryAnimation: secondaryAnimation,
            transitionType: _transitionType,
            child: child,
          );
        });
  }
}
```

Like i said up there, it's a class that will implement a custom animation on page transitions.

Now let's write the `navigation.dart`:

```dart
import 'package:flutter/material.dart';
import 'transitions.dart';

void goto(BuildContext context, Widget screen, {bool isReplaced = false}) {
  isReplaced
      ? Navigator.of(context)
          .pushReplacement(Transitions.sharedAxisPageTransition(screen))
      : Navigator.of(context)
          .push(Transitions.sharedAxisPageTransition(screen));
}
```

As you can see, this will just use our class declared in our previous `transitions.dart`.

We've got our utilities now, let's now see what is inside our `app.dart` file:

```dart
import 'package:flutter/material.dart';

class App extends StatelessWidget {
  const App({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '#title',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: null,
    );
  }
}
```

Notice that we've set the title value to: `#title`. We will talk about it later.

And finally, our `main.dart` file:

```dart
import 'package:flutter/material.dart';
import './src/app.dart';

void main() {
  runApp(const App());
}
```

Ok, we got all of our file for now. What we need to do is to copy the utilities inside the _src/helpers_ folder, the `app.dart` inside the _src_ folder and change the `main.dart` file.

For simplicity, let's create a _helpers_ folder inside our _templates_ and move these files inside it: `spacing.dart, transitions.dart, navigation.dart`.

Let's get back to the `utils` and these lines:

```js
// utils.js

import { resolve, join, dirname } from "path";
import { error, success, info } from "./log";
import { existsSync, mkdirSync, readdirSync, statSync, copyFileSync } from "fs";

const createFolders ...
...

const copyDirectoryContent = (source, destination) => {
  mkdirSync(destination, { recursive: true }); // Create the destination directory if it doesn't exist

// Read our directory
  readdirSync(source).forEach((file) => {
    const srcPath = join(source, file);
    const destPath = join(destination, file);
    if (statSync(srcPath).isDirectory()) {
      copyDirectoryContent(srcPath, destPath); // Recursively copy subdirectories
    } else {
      copyFileSync(srcPath, destPath); // Copy files
    }
  });
};

const copyFiles = (project) => {
  const templateDir = resolve(dirname(""), "templates");
  // Copy all our files from inside our templates/helpers dir to the project
  copyDirectoryContent(
    resolve(templateDir, "helpers"),
    resolve(project, "lib/src/helpers")
  );
};

export { createFolders, copyFiles };
```

Now, let's update our `actions.js` file to use it:

```js
// actions.js
...

dependencies.on("close", () => {
      success(`Dependencies are correctly added...`);
      info(`Creating folders...`);
      createFolders(project);
      info(`Copying utility files...`);
      copyFiles(project);
      success("Project created correctly");
    });

...
```

Don't forget to import the _copyFiles_ from the `utils.js` file.

Now, let's test our code and... Yes! It will first create the project, add dependencies and add our helper files.

Ok, so far so good 👍 😊

Let's not forget our `main.dart` and `app.dart` files.

```js
// utils.js
...

const copyFiles = (project) => {
  const templateDir = resolve(dirname(""), "templates");
  const appFile = resolve(project, "lib/src/app.dart");
  copyDirectoryContent(
    resolve(templateDir, "helpers"),
    resolve(project, "lib/src/helpers")
  );

  copyFileSync(
    resolve(templateDir, "main.dart"),
    resolve(project, "lib/main.dart")
  );

  copyFileSync(resolve(templateDir, "app.dart"), appFile);
};
...
```

OK. I've add the `main.dart` file to the list of the file to copy. Now, time to add `app.dart`. Let's talk about it:

If you remember, our `app.dart` file has a weird line inside it:

```dart
    return MaterialApp(
      title: '#title',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: null,
    );
```

You called it, it's the `title: '#title'`. That because we will replace it by the name of our project. But we need to copy it first then replace its content.

```js
// utils.js

...

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const copyFiles = (project) => {
  const templateDir = resolve(dirname(""), "templates");
  const appFile = resolve(project, "lib/src/app.dart");
  copyDirectoryContent(
    resolve(templateDir, "helpers"),
    resolve(project, "lib/src/helpers")
  );

  copyFileSync(
    resolve(templateDir, "main.dart"),
    resolve(project, "lib/main.dart")
  );

  copyFileSync(resolve(templateDir, "app.dart"), appFile);

  const data = readFileSync(appFile, "utf8").replace(
    "#title",
    capitalize(project)
  );

  writeFileSync(appFile, data);
};

...
```

That's it! We copy the `app.dart` first, then we will read it and replace the string _#title_ by the name of the project capitalized.

Time to test! 😁

```bash
> fluttertool

? What do you want to do? 1 - Create a new project

========================================
OK! Let's create your wonderful project!
========================================

? What is the name of your project? myproject
? What is the name of your organization? test
Creating project skeleton...
Adding dependencies...
✔ Dependencies are correctly added...
Creating folders...
✔ Folders and files are correctly created
Copying utility files...
✔ Project created correctly
```

Yes! We made it! Time for the next step: creating module.

## Stacked Module

I will not discuss about the [stacked module]() as it will require an entire about it (let me know if you want one).

A module consists of two files: the view and the viewmodel that we will copy inside _lib/src/views/screens_ folder.

Let's create our module template inside our _templates_ directory.

![templatefolder](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ka56m2lcxci1xwtcwtjl.png)

Don't worry about the files being red.

Let's see what inside them:

```dart
// module_viewmodel.dart

import 'package:stacked/stacked.dart';
class ModuleViewModel extends BaseViewModel {}

```

---

```dart
// module_view.dart

import 'package:flutter/material.dart';
import 'package:stacked/stacked.dart';
import './module_viewmodel.dart';

class ModuleView extends StatelessWidget {
  const ModuleView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ViewModelBuilder<ModuleViewModel>.reactive(
      viewModelBuilder: () => ModuleViewModel(),
      builder: (
        BuildContext context,
        ModuleViewModel model,
        Widget? child,
      ) {
        return Scaffold(
          body: Center(
            child: Text(
              'ModuleView',
            ),
          ),
        );
      },
    );
  }
}
```

We will apply the same process as we did with the `app.dart`.

But we will add some extra lines inside `utils.js`:

```js
// utils.js

import { resolve, join, dirname } from "path";
import { error, success, info } from "./log";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  copyFileSync,
  readFileSync,
  writeFileSync,
} from "fs";

let SCREENPATH = "lib/src/views/screens";

...

const renameModuleFiles = (path, module, filename) => {
  const changes = readFileSync(path, "utf8")
    .replaceAll("Module", capitalize(module))
    .replace("module", module);

  writeFileSync(
    `${SCREENPATH}/${module}/${filename.replace(
      "module",
      module.toLowerCase()
    )}`,
    changes
  );
};

const createStackedModuleBoilerplate = (module) => {
  const templateDir = resolve(dirname(""), "../templates/modules");
  const files = ["module_view.dart", "module_viewmodel.dart"];

  try {
    const _path = resolve(SCREENPATH, module);
    if (!existsSync(_path)) {
      mkdirSync(_path);
    }

    files.forEach((file) => {
      const _path = resolve(SCREENPATH, module, file);

      if (!existsSync(_path)) {
        renameModuleFiles(resolve(templateDir, file), module, file);
      }
    });

    success(`${capitalize(module)} module is correctly created`);
  } catch (err) {
    error(err);
  }
};

...

export { createFolders, copyFiles, createStackedModuleBoilerplate };
```

Ok, what's going on here:

- We create a folder according to the name the user gave
- We copy the files from _templates/modules_ inside that folder
- Rename those file copied and replace all placeholder string inside it by the name of the module

All we have to do is to call this function inside our `actions.js`

```js
// actions.js
...
const createModule = async () => {
  const {module} = await inquirer.prompt([
    {
      type: "input",
      name: "project",
      message: "What is the name of your module?",
    },
  ]);

  if (module) {
    createStackedModuleBoilerplate(module);
    return;
  }

  error("You need to specify a module name!");
};

...
```

❌ Careful!, as we will create the module inside the _lib/src/views/screens_ we need to be in the root of the project to have it working.

Test time ‼️

```bash
> fluttertool

? What do you want to do? 2 - Add a new stacked module
? What is the name of your module? signin
✔ Signin module is correctly created

```

Yay! 🥳🥳

Let's do a full example by creating a project and adding a home module to it:

```bash
> fluttertool

? What do you want to do? 1 - Create a new project

========================================
OK! Let's create your wonderful project!
========================================

? What is the name of your project? myproject
? What is the name of your organization? test
Creating project skeleton...
Adding dependencies...
✔ Dependencies are correctly added...
Creating folders...
✔ Folders and files are correctly created
Copying utility files...
✔ Project created correctly
```

---

```bash
> cd myproject && fluttertool
? What do you want to do? 2 - Add a new stacked module
? What is the name of your module? home
✔ Home module is correctly created
```

What we've got now:

![project structure](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/1ssim0n5nx0dofdo7gu1.png)

Let's see what we have inside our `home_view.dart` and `home_viewmodel.dart`

![home_view](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/m5el3qg728vyjewl1tg7.png)

![home_viewmodel](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ynmsovjdmy3275yhfv43.png)

What we've done so far:

- adding our template files and arrange them correctly
- change our `main.dart` file when we add `app.dart`
- implement our module creator

What we will see next in the last step is how we can add shortcuts to our cli tool like:

```bash
> fluttertool -m <modulename>
> flutter -h
```

Stay tune! See you next time! 👋

<a href="https://www.buymeacoffee.com/ailifidaach" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
