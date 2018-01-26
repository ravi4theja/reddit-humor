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

class Post extends Component {

  mediaEl = null;
  scrollIntervalId = null;
  setTimeoutIdToTop = null;
  setTimeoutIdToBottom = null;

  scrollToBottom = () => {
    this.scrollIntervalId = setInterval(() => {
      let prevScrollTop = this.mediaEl.scrollTop;
      this.mediaEl.scrollTop += 1;
      if(this.mediaEl.scrollTop === prevScrollTop) {
        clearInterval(this.scrollIntervalId);
        this.setTimeoutIdToTop = setTimeout(this.scrollToTop, 2000);
      }
    }, 20)
  }

  scrollToTop = () => {
    this.scrollIntervalId = setInterval(() => {
      this.mediaEl.scrollTop -= 1;
      if(this.mediaEl.scrollTop === 0) {
        clearInterval(this.scrollIntervalId);
        this.setTimeoutIdToBottom = setTimeout(this.scrollToBottom, 2000);
      }
    }, 20)
  }


  setMediaStyles = media => {
    let height, width;
    if(this.mediaEl) {
      if (media.height * 0.7 > media.width && media.height > this.mediaEl.clientHeight * 1.5){
        width = Math.min(media.width, this.mediaEl.clientWidth)
        height = 'auto';
      } else {
        width = 'auto';
        height = Math.min(media.height, this.mediaEl.clientHeight * 0.9);
      }
    }
    
    return {
      margin: 2,
      height,
      width,
      maxWidth: '85%',
      borderRadius: 2 
    }
  }

  componentDidMount() {
    this.forceUpdate();
    this.scrollToBottom();
  }

  componentWillReceiveProps(nextProps) {
    clearInterval(this.scrollIntervalId);
    if(this.setTimeoutIdToTop) clearTimeout(this.setTimeoutIdToTop);
    if(this.setTimeoutIdToBottom) clearTimeout(this.setTimeoutIdToBottom);
    this.scrollToBottom();
  }

  render() {
    const { classes } = this.props;
    const postData = this.props.post.data;
    const media = postData.preview? util.isGIF(postData.preview.images[0]): undefined;
    
    return (
      <CSSTransition
        timeout={500}
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
