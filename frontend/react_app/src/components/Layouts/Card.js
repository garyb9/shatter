import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import { BiHeart, BiComment, BiShareAlt } from "react-icons/bi";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ButtonBase from '@material-ui/core/ButtonBase';
import { Container, Row, Col } from "react-bootstrap";
import Divider from '@material-ui/core/Divider';


const useStyles = makeStyles((theme) => ({
  root: {
    width: 600,
    backgroundColor: "#242526",
    color: "inherit",
    '&:hover': {
      background: "#313335",
   },
  },
  header: {
    wordWrap: "break-word",
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  avatar: {
    // backgroundColor: '#228B22',
    width: '38px',
    height: '38px',
  },
  title: {
    color: 'inherit',
    wordWrap: "break-word"
  },
  subheader: {
    color: 'inherit',

  },
  button: {
    display: 'block',
    textAlign: 'initial'
  },
  iconButton: {
    color: "inherit",
    width: 55,
    height: 55,
    display: "flex", 
    justifyContent: "center",
    alignItems: "center",
  },
  icon:{
    marginRight: "50%",
  }
}));


export default function ImageboardCard(props) {
  const classes = useStyles();

  const handleLikeClick = () => {
    // TODO: fill in
  };

  const handlePostClick = () => {
    // TODO: fill in
  };

  const handleShareClick = () => {
    // TODO: fill in
  };
  
  return (
    <Card hoverable className={classes.root}>
      {/* <ButtonBase onClick={() => { }}> */}
      <CardHeader className={classes.header}
        avatar={
          <Avatar 
          aria-label="Creator" 
          src={process.env.PUBLIC_URL + '/defAvatar.jpg'}
          className={classes.avatar}>
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <Typography variant="body1" component="p" className={classes.title}>
            {props.subject ? props.subject : null}
          </Typography>         
        }
        subheader={
          <Typography variant="body2" className={classes.subheader}>
            {props.created ? props.created : null}
          </Typography>          
        }
      />
      
      <CardContent>
        <Typography paragraph variant="body2" component="p" /*style={{ wordWrap: "break-word" }}*/>
          {props.text ? props.text : null}
        </Typography>
      </CardContent>

      {props.thumbnail ? 
        <CardMedia
          className={classes.media}
          component="img"
          image={props.thumbnail ? props.thumbnail : null}
          title={props.fileName ? props.fileName : null}
        />
      : null} 
      
      {/* </ButtonBase> */}

      <Divider/>  

      <div disableSpacing>
        <Container fluid>
          <Row className="justify-content-md-center" style={{ marginLeft: "60px"}}>
            <Col>
              <IconButton size='small' aria-label="Like" disableRipple className={classes.iconButton}>
                <BiHeart className={classes.icon}/>
              </IconButton>
            </Col>
            <Col>
              <IconButton size='small' aria-label="Post" disableRipple className={classes.iconButton}>
                <BiComment className={classes.icon}/>
              </IconButton>
            </Col>
            <Col>
              <IconButton size='small' aria-label="Share" disableRipple className={classes.iconButton}>
                <BiShareAlt className={classes.icon}/>
              </IconButton>
            </Col>
          </Row>
        </Container> 
      </div>
      
    </Card>
  );
}
