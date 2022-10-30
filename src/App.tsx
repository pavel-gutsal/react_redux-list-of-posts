/* eslint-disable max-len */
import React, { useEffect } from 'react';
import 'bulma/bulma.sass';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.scss';

import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { fetchUsers } from './features/users/users';
import { PostsList } from './components/PostsList';
import { PostDetails } from './components/PostDetails';
import { UserSelector } from './components/UserSelector';
import { Loader } from './components/Loader';
import { fetchPosts, clearPosts } from './features/posts/posts';
import { selectPost } from './features/selectedPost/selectedPost';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();

  const { author } = useAppSelector(state => state.author);
  const { posts, status, error } = useAppSelector(state => state.posts);
  const { selectedPost } = useAppSelector(state => state.selectedPost);

  useEffect(() => {
    dispatch(selectPost(null));

    if (author) {
      dispatch(fetchPosts(author.id));
    } else {
      dispatch(clearPosts());
    }
  }, [author?.id]);

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  return (
    <main className="section">
      <div className="container">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box is-success">
              <div className="block">
                <UserSelector />
              </div>

              <div className="block" data-cy="MainContent">
                {!author && (
                  <p data-cy="NoSelectedUser">
                    No user selected
                  </p>
                )}

                {author && status === 'pending' && (
                  <Loader />
                )}

                {author && status === 'failed' && error && (
                  <div
                    className="notification is-danger"
                    data-cy="PostsLoadingError"
                  >
                    {error}
                  </div>
                )}

                {
                  author
                  && status === 'fullfilled'
                  && posts
                  && posts.length === 0 && (
                    <div className="notification is-warning" data-cy="NoPostsYet">
                      No posts yet
                    </div>
                  )
                }

                {
                  author
                  && status === 'fullfilled'
                  && posts
                  && posts.length > 0 && (
                    <PostsList posts={posts} />
                  )
                }
              </div>
            </div>
          </div>

          <div
            data-cy="Sidebar"
            className={classNames(
              'tile',
              'is-parent',
              'is-8-desktop',
              'Sidebar',
              {
                'Sidebar--open': selectedPost,
              },
            )}
          >
            <div className="tile is-child box is-success ">
              {selectedPost && (
                <PostDetails post={selectedPost} />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};