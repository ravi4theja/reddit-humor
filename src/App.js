import React, { Component } from 'react';
import 'whatwg-fetch';
import Post from './components/Post';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import * as util from './utils';
import * as consts from './constants';
import screenfull from 'screenfull';

const styles = theme => ({
  post: {
    margin: 5,
    padding: 20,
    height: '100%',
    position: 'relative',
  },
  paper: {
    padding: 20,
    height: '100%',
    boxShadow: '0px 0px 83px -8px rgba(0,0,0,0.75)',
    borderRadius: '5px 5px 5px 5px'
  },
  btns: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    right: 50,
    top: '45%'
  },
  btn: {
    borderRadius: '999em'
  }
})

class App extends Component {

  state = {
    posts: [],
    currentPost: undefined,
    show: false
  }

  postsIntervalId = null;
  NSFWPOSTS = {};

  initPosts = async () => {

    const posts = await util.fetchPosts(consts.URLS)
                        .then(data => {
                          const results = [].concat(...data.map(result => result.data.children));
                          return results.filter(post => !post.data.stickied && !this.NSFWPOSTS[post.data.id]);
                        })

    this.setState(prevState => ({posts, currentPost: 0, show: !prevState.show}), () => {
      this.postsIntervalId = setInterval(this.updatePost, 20000)
    })

  }

  updatePost = () => {
    clearInterval(this.postsIntervalId);
    this.setState(prevState => ({show: !prevState.show}), () => {
      if(this.state.currentPost === this.state.posts.length - 1) this.initPosts();
      else {
        this.setState(prevState => ({currentPost: ++prevState.currentPost, show: !prevState.show}), () => {
          this.postsIntervalId = setInterval(this.updatePost, 20000)
        })
      }  
    })
  }

  componentDidMount() {
      this.initPosts();
  }

  blackList = id => this.NSFWPOSTS[id] = true;

  handleClickFullScreen = () => {
    if (screenfull.enabled) {
      screenfull.request();
    } else {
      alert('full screen is not enabled')
    }
  }

  render() {
    const { classes } = this.props;
    const { posts, currentPost, show } = this.state;
    const post = posts[currentPost];

    return (
      <div className="App">
        {this.state.posts.length !== 0  && 
          <div className={classes.post}>
            <div className={classes.paper}>
              <Post 
                post={post} 
                show={show}
              />
            </div>
            <div className={classes.btns}>
              <Button raised className={classes.btn} onClick={this.updatePost}>NEXT</Button>
              <Button raised className={classes.btn} style={{marginTop: 15}} onClick={() => { this.blackList(post.data.id)}}>NSFW?</Button>
              <Button 
                raised 
                className={classes.btn}
                style={{marginTop: 15, display: screenfull.isFullscreen? 'none': 'block'}}
                onClick={this.handleClickFullScreen}>FullScreen
              </Button>
            </div>  
          </div>
        }
      </div>
    );
  }
}

export default withStyles(styles)(App);
