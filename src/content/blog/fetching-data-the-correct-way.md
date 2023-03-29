---
title: "Fetching data the correct way"
description: "If you've worked on a React project, chances are you have fetched data from APIs"
pubDate: "12 Mar 2023"
heroImage: "/d6ijnxz2bo7o9uv8bmwf.png"
author: "Lynxgsm"
draft: true
---

If you've worked on a React project, chances are you have fetched data from APIs. But have you never asked yourself if your way of doing was correct?

Don't get me wrong, when i say "correct", i don't mean that i have the perfect solution to this but we will attempt to eradicate data mismatch by validating it before consuming it.

In order to do that, we will use two main tools: [TanStack Query](https://tanstack.com/query/v4/docs/react/quick-start) and [Zod](https://zod.dev/)

## TanStack Query or React Query

### What is React Query?

React Query is a powerful library for managing data in React applications. It offers an elegant and efficient way to handle complex data fetching, caching, and synchronization, allowing to build responsive and high-performing applications with ease.

### Why should you use it?

One of the major benefits of React Query is its ability to cache data. This means that once data is fetched from an API, it is stored in memory and can be accessed quickly and efficiently. This is especially useful for applications that rely heavily on data fetching, as it helps to reduce the load on the network and improve performance

React Query is also easy to integrate into existing React applications. It works seamlessly with other popular libraries such as Redux and MobX, and can be easily integrated into a wide range of different architectures and design patterns.

## Zod

Zod is a powerful TypeScript schema validation library that allows to define and validate data schemas with ease. It provides a simple and intuitive API for validating data, ensuring that it conforms to a specific set of rules and constraints. This makes easier for us to catch errors and bugs early in the development process.

## TypeScript + React Query + Zod = Peace of mind 😇

Ok, enough theory, let's get down to practice. First, let's create a simple TypeScript React Vite app but running:

```bash
> pnpm create vite
> ✔ Project name: datafetching
> ✔ Select a framework: › React
> ✔ Select a variant: › TypeScript
```

Let's install our dependencies:

```bash
> pnpm add zod @tanstack/react-query
```

For our example, we'll use the [Dev.to API](https://dev.to/api/articles?username=lynxgsm) which will return every article a user has published. In our case, this API will return every article i wrote (go read them if you haven't yet 😁).

OK, let's see what we got here:

![postman api request](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/yhtef05pi94gaghbyijw.png)

Our first task is to create types for this json response. I found [this website](https://jvilk.com/MakeTypes/) that can generate it for us. Just paste the json result response and it will generate interfaces for you, i'll just change `interface` by `type`, but honestly you can leave it as it is (let's not talk about why i've made this change as it's not the main concern of this article).

And this is what we get:

![generated interfaces](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/nd9s7lu22dk4bv5pr6hd.png)

As you can see, we will have two interfaces: Article and User. Let's create a folder named _types_ inside our _src_ folder and create two respective files: _article.ts_ and _user.ts_.

```ts
// user.ts

export type User = {
  name: string;
  username: string;
  twitter_username: string;
  github_username: string;
  user_id: number;
  website_url: string;
  profile_image: string;
  profile_image_90: string;
};
```

---

```ts
// article.ts

import { User } from "./user";

export type Articles = {
  type_of: string;
  id: number;
  title: string;
  description: string;
  readable_publish_date: string;
  slug: string;
  path: string;
  url: string;
  comments_count: number;
  public_reactions_count: number;
  collection_id?: null;
  published_timestamp: string;
  positive_reactions_count: number;
  cover_image: string;
  social_image: string;
  canonical_url: string;
  created_at: string;
  edited_at?: string | null;
  crossposted_at?: null;
  published_at: string;
  last_comment_at: string;
  reading_time_minutes: number;
  tag_list?: string[] | null;
  tags: string;
  user: User;
};
```

Ok, let's head back to our _App.tsx_ file and delete everything:

```tsx
function App() {
  return <div></div>;
}

export default App;
```

Good! Now, our main goal is to fetch and display data from our API using React Query and Zod. Let's start by initializing our react query client. Open _main.tsx_ and make this changes:

```tsx
// main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
```

We can now use the React Query inside our _App.tsx_

```tsx
import { useQuery } from "@tanstack/react-query";

function App() {
  const getArticles = () => {};

  const { data, isLoading, isFetching, error, isError } = useQuery({
    queryKey: ["articles"], // query key that will help to cache data, you can set it whatever you like
    queryFn: getArticles, // the function that will be executed to actually fetch the data
  });

  return <div></div>;
}

export default App;
```

Let's try to implement the `getArticles` function to actually fetch the data.

### Naive approach

```tsx
const { VITE_BASE_URL } = import.meta.env;

const getArticles = (): Promise<Article[]> =>
  fetch(VITE_BASE_URL).then((res) => res.json());
```

---

Of course, here we are using an env key that will be loaded from _.env_ file that you need to create.

```
// .env
// If you want, you can replace the username by yours to fetch your articles published on [Dev.to](https://dev.to/)
VITE_BASE_URL=https://dev.to/api/articles?username=lynxgsm
```

---

Here is our final _App.tsx_ file:

```tsx
import { useQuery } from "@tanstack/react-query";
import { Article } from "./types/article";
import { z } from "zod";

function App() {
  const { VITE_BASE_URL } = import.meta.env;

  const getArticles = (): Promise<Article[]> =>
    fetch(VITE_BASE_URL).then((res) => res.json());

  const { data, isLoading, isFetching, error, isError } = useQuery({
    queryKey: ["articles"], // a key that will help to retrieve data
    queryFn: getArticles, // the function that will be executed to actually fetch the data
  });

  if (isLoading) {
    return <p>Data is loading...</p>;
  }

  if (isFetching) {
    return <p>Data is fetching...</p>;
  }

  if (error) {
    return <p>There was an error when fetching your data.</p>;
  }

  return (
    <ul>
      {data?.map((article) => {
        return <li key={article.id}>{article.title}</li>;
      })}
    </ul>
  );
}

export default App;
```

Let's start our app and see that our data has been fetched correctly.

![app running](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kn4gxlld0o57iqdjgs0p.png)

Ok, you've probably used this way of fetching data before and you are yelling at your computer right now that there is nothing wrong with it.

But trust me on this one: you are not doing it the right way. Let me explain, you are telling your TypeScript code that the data returned is of type Array of Article which is not correct.

Let's try to add another key inside our User type:

```ts
// user.ts

export type User = {
  name: string;
  username: string;
  twitter_username: string;
  github_username: string;
  user_id: number;
  website_url: string;
  profile_image: string;
  profile_image_90: string;
  avatar: string; // This is the new key
};
```

We've added the **avatar** key although it doesn't exists in our data. Then, let's try to display it:

```tsx
// App.tsx

return (
  <ul>
    {data?.map((article) => {
      return (
        <li key={article.id}>
          {article.title} - {article.user.avatar}
        </li>
      );
    })}
  </ul>
);
```

Let's rerun our App:

![app rerun](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kpbsy9c0f0vdmn70ulcs.png)

As you can see, even though the data doesn't exist, TypeScript will try to display it without any error. And that may be problematic if you are doing some operations with the incorrect field.

That's where Zod comes in action.

### Validating data with Zod

Zod is validating data with schemas. Let's create a folder named _schemas_ inside _src_ and create `user.ts` and `article.ts`.

```ts
// user.ts

import { z } from "zod";

export const UserSchema = z.object({
  name: z.string(),
  username: z.string(),
  twitter_username: z.string(),
  github_username: z.string(),
  user_id: z.number(),
  website_url: z.string(),
  profile_image: z.string(),
  profile_image_90: z.string(),
});
```

We are defining the user schema with Zod. User is an object with keys and different value types. Now let's see the `article.ts`:

```ts
// article.ts

import { z } from "zod";
import { UserSchema } from "./user";

export const ArticleSchema = z.object({
  type_of: z.string(),
  id: z.number(),
  title: z.string(),
  description: z.string(),
  readable_publish_date: z.string(),
  slug: z.string(),
  path: z.string(),
  url: z.string(),
  comments_count: z.number(),
  public_reactions_count: z.number(),
  published_timestamp: z.string(),
  collection_id: z.string(),
  positive_reactions_count: z.number(),
  cover_image: z.string(),
  social_image: z.string(),
  canonical_url: z.string(),
  created_at: z.string(),
  edited_at: z.string(),
  published_at: z.string(),
  last_comment_at: z.string(),
  reading_time_minutes: z.number(),
  tag_list: z.array(z.string()),
  tags: z.string(),
  user: UserSchema,
});

export const ArticlesSchema = z.array(ArticleSchema);
```

Now let's implement this schema on our data fetcher:

```ts
// App.tsx

import { useQuery } from "@tanstack/react-query";
import { Article } from "./types/article";
import { z } from "zod";
import { ArticleSchema, ArticlesSchema } from "./schemas/article";

function App() {
  const { VITE_BASE_URL } = import.meta.env;

  const getArticles = () =>
    fetch(VITE_BASE_URL)
      .then((res) => res.json())
      .then((data) => ArticlesSchema.parse(data));

  const { data, isLoading, isFetching, error, isError } = useQuery({
    queryKey: ["articles"], // a key that will help to retrieve data
    queryFn: getArticles, // the function that will be executed to actually fetch the data
  });

  if (isLoading) {
    return <p>Data is loading...</p>;
  }

  if (isFetching) {
    return <p>Data is fetching...</p>;
  }

  if (error) {
    return <p>There was an error when fetching your data.</p>;
  }

  return (
    <ul>
      {data?.map((article) => {
        return <li key={article.id}>{article.title}</li>;
      })}
    </ul>
  );
}

export default App;
```

Let's try to run our application and ...

![zod error](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/06qcgbjagt2m51r2u9kw.png)

Uh oh! We've got an error, but what a beautiful and accurate error! You can see that with the help of Zod, we can easily know which data is faulty.

Because we don't like to see these red lines, let's correct our article schema:

```ts
// schemas/article.ts

export const ArticleSchema = z.object({
  type_of: z.string(),
  id: z.number(),
  title: z.string(),
  description: z.string(),
  readable_publish_date: z.string(),
  slug: z.string(),
  path: z.string(),
  url: z.string(),
  comments_count: z.number(),
  public_reactions_count: z.number(),
  published_timestamp: z.string(),
  collection_id: z.nullable(z.string()),
  positive_reactions_count: z.number(),
  cover_image: z.string(),
  social_image: z.string(),
  canonical_url: z.string(),
  created_at: z.string(),
  edited_at: z.nullable(z.string()),
  published_at: z.string(),
  last_comment_at: z.string(),
  reading_time_minutes: z.number(),
  tag_list: z.array(z.string()),
  tags: z.string(),
  user: UserSchema,
});
```

By making certain keys nullable, we got rid of those red lines. Zod helped us to validate data efficiently.

## Conclusion

React Query, TypeScript, and Zod are powerful tools that can greatly improve the efficiency and reliability of web application development.

React Query handles data fetching and caching where Zod is handling data validation.

Together, these tools form a robust framework for building modern web applications. As such, you should consider incorporating them into your development workflows.

That's it folks! See you next time! 👋

<a href="https://www.buymeacoffee.com/ailifidaach" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
