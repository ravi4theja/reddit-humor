import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { CSSTransition } from 'react-transition-group';

import * as util from '../../utils';

const styles = theme => ({
  title: {
    margin: 5,
    padding: '10px 20px',
    height: '6%'
  },
  content: {
    marginTop: 15,
    padding: 20,
    height: '90%',
    overflow: 'hidden'
  }
})

let scrollIntervalId, setTimeoutIdToTop, setTimeoutIdToBottom;

class Post extends Component {

  mediaEl = null;

  scrollToBottom = () => {
    scrollIntervalId = setInterval(() => {
      let prevScrollTop = this.mediaEl.scrollTop;
      this.mediaEl.scrollTop += 1;
      if(this.mediaEl.scrollTop === prevScrollTop) {
        clearInterval(scrollIntervalId);
        setTimeoutIdToTop = setTimeout(this.scrollToTop, 2000);
      }
    }, 20)
  }

  scrollToTop = () => {
    scrollIntervalId = setInterval(() => {
      this.mediaEl.scrollTop -= 1;
      if(this.mediaEl.scrollTop === 0) {
        clearInterval(scrollIntervalId);
        setTimeoutIdToBottom = setTimeout(this.scrollToBottom, 2000);
      }
    }, 20)
  }

  setMediaStyles = media => {
    let height, width;
    if(this.mediaEl) {
      if (media.height > media.width && media.height > this.mediaEl * 0.8 * 1.5){
        width = Math.min(media.width, this.mediaEl.clientWidth * 0.8)
      } else {
        height = Math.min(media.height, this.mediaEl.clientHeight * 0.8)
      }
    }
    
    return {
      margin: 2,
      height,
      width,
      borderRadius: 2 
    }
  }

  componentDidMount() {
    this.forceUpdate();
    this.scrollToBottom();
  }

  componentWillReceiveProps(nextProps) {
    clearInterval(scrollIntervalId);
    if(setTimeoutIdToTop) clearTimeout(setTimeoutIdToTop);
    if(setTimeoutIdToBottom) clearTimeout(setTimeoutIdToBottom);
    this.scrollToBottom();
  }

  render() {
    const { classes } = this.props;
    const postData = this.props.post.data;
    const media = postData.preview? util.isGIF(postData.preview.images[0]): undefined;
    
    return (
      <CSSTransition
        timeout={1000}
        classNames='fade'
        in={this.props.show}
        appear={true}
      >       
        <div style={{width: '100%', height: '100%'}} key={postData.id}>
          <Typography type='title' className={classes.title}>{postData.title}</Typography>
          <div className={classes.content} ref={el => {this.mediaEl = el}}>
            {media && 
              <img 
                style={this.setMediaStyles(media)} 
                key={media.url} 
                src={media.url} 
                alt='lol' 
              />
            }
            {postData.selftext_html && <div dangerouslySetInnerHTML={{__html: postData.selftext_html}}></div>}
          </div>      
        </div>
      </CSSTransition>      
    )
  }
} 

export default withStyles(styles)(Post);