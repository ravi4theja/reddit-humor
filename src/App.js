import React, { Component } from 'react';
import './App.css';
import 'whatwg-fetch';
import Post from './components/Post';

const fetchPosts = url => fetch(url).then(res => res.json());

let postsIntervalId;
const NSFWPOSTS = {};

class App extends Component {

  state = {
    posts: [],
    currentPost: undefined,
    show: false
  }

  initPosts = async () => {
    const posts = await fetchPosts('https://www.reddit.com/r/programmerhumor/hot/.json?raw_json=1')
                        .then(data => data.data.children.filter(post => !post.data.stickied && !NSFWPOSTS[post.data.id]));
    this.setState(prevState => ({posts, currentPost: 0, show: !prevState.show}), () => {
      postsIntervalId = setInterval(() => {
        this.updatePost()
      }, 20000)
    })
  }

  updatePost = () => {
    clearInterval(postsIntervalId);
    this.setState(prevState => ({show: !prevState.show}), () => {
      if(this.state.currentPost === this.state.posts.length - 1) {     
        this.initPosts();
      } 
      else {
        this.setState(prevState => ({currentPost: ++prevState.currentPost, show: !prevState.show}), () => {
          postsIntervalId = setInterval(() => {
            this.updatePost()
          }, 20000)
        })
      }  
    })
  }

  componentDidMount() {
      this.initPosts();
  }

  blackList = id => NSFWPOSTS[id] = true;

  render() {
    
    const { show } = this.state;

    return (
      <div className="App" style={{width: window.innerWidth, height: window.innerHeight}}>
        {this.state.posts.length !== 0  && 
          <Post 
            post={this.state.posts[this.state.currentPost]} 
            onClickNext={this.updatePost} 
            onClickNSFW={this.blackList}
            in={show}
          />
        }
      </div>
    );
  }
}

export default App;
