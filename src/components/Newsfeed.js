import React from "react";
import { connect } from "react-redux";
import {Line} from 'react-chartjs-2';
import { getData, updatePageNum, modifyData } from "../store/actions/index";
import Cookies from 'cookies-js';
import { parse } from 'url';
import { Helmet } from 'react-helmet';
import TimeAgo from 'react-timeago'
import FontAwesome from 'react-fontawesome'
// import "./newsfeed.css"

class Newsfeed extends React.Component {
    constructor ( props ) {
        super( props );
    
        this.vote = this.vote.bind(this);
        this.getNextPage = this.getNextPage.bind(this);
        this.goToPrevious = this.goToPrevious.bind(this);
        this.hide = this.hide.bind(this);
        this.head = this.head.bind(this);
        this.graphdata = {
          labels: [],
          datasets: [
            {
              label: 'votes',
              fill: false,
              lineTension: 0.5,
              backgroundColor: 'rgba(75,192,192,1)',
              borderColor: 'rgba(0,0,0,1)',
              borderWidth: 2,
              data: []
            }
          ]
        }    

    }
    componentDidMount( ) {
       
    }

    componentDidUpdate(prevprops) {
       if(prevprops.currentPage !==this.props.currentPage) {
          this.props.onFetchData(this.props.currentPage);
        }
    }
    
    vote(itemId,index){
      let upvotedIds = {};
       if(Cookies.get('upvotes')){
        upvotedIds = JSON.parse(Cookies.get('upvotes'));
       }
        upvotedIds[itemId] = this.props.newsItems.hits[index].points+1;
        Cookies.set('upvotes',JSON.stringify(upvotedIds) );
        const likedData = this.props.newsItems.hits.map((news)=>{
          if(news.objectID === itemId) {
            let votes = news.points+1;
            return {
              ...news,
              points: votes
            }

          }
          return news;
        });
        const updatedData = {
          ...this.props.newsItems,
          hits:likedData
        }
        this.props.onModifyData(updatedData);
    }
    getNextPage(){
        let nextPage = this.props.currentPage;

        if(nextPage === 0) {
            nextPage=nextPage+2;
        }
        else {
            nextPage++;
        }
        this.props.onUpdatePage(nextPage);
        this.props.history.push(`/news?p=${nextPage}`);
    }

    goToPrevious(){
        this.props.history.goBack();
        this.props.onUpdatePage(this.props.currentPage-1);
    }
    hide(item){
      let hiddenIds = [];
       if(Cookies.get('hidden')){
         hiddenIds = JSON.parse(Cookies.get('hidden'));
         hiddenIds.push(item.objectID); 
       }
       else {
         hiddenIds.push(item.objectID);
       }
        Cookies.set('hidden',JSON.stringify(hiddenIds) );
        
        let hiddenState = this.props.newsItems.hits.filter((news) => {
          return hiddenIds.indexOf(news.objectID) == -1;
        })
        const modifiedpageData = {
          ...this.props.newsItems,
          hits:hiddenState
        }
        this.props.onModifyData(modifiedpageData);
      }

    head() {
      return (
        <Helmet>
          <meta charset="utf-8"/>
          <meta property="og:title" content="React SSR" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta
            property="og:description"
            content="Hacker news using React ssr"
          />
          <meta property="og:type" content="website" />
        </Helmet>
      );
    }      

    render( ) {
          let allNews = this.props.newsItems;
          if(allNews && allNews.hits) {
            this.graphdata.datasets[0].data = allNews.hits.map((value)=>{
              return value.points;
            })
            this.graphdata.labels = allNews.hits.map((value)=>{
              return value.objectID;
            })
          }

        return ( 
            <React.Fragment>
            <main>
            {this.head()}
              {this.props.loading?<div>Loading....</div>:(
                <table className="table-container" width="100%" role="table" aria-label="Destinations">
                <caption>Hacker News</caption>
                <thead>
                  <tr className="flex-table header" role="rowgroup">
                    <th className="flex-row first" role="columnheader">Comments</th>
                    <th className="flex-row" role="columnheader">Vote Count</th>
                    <th className="flex-row" role="columnheader">Up Votes</th>
                    <th className="flex-row newsdetailheader" role="columnheader">News Details</th>
                  </tr>
                </thead>
                <tbody>
                {
                  allNews && allNews.hits && allNews.hits.map((newsItem,index) => {
                    return (

                        <tr key={newsItem.objectID} className="flex-table row" role="rowgroup">
                          <td className="flex-row first comments " role="cell">{newsItem.num_comments ? newsItem.num_comments : 0}</td>
                          <td className="flex-row comments" role="cell">{newsItem.points}</td>
                          <td className="flex-row comments" role="cell"><FontAwesome
                                className="fas fa-caret-up"
                                name="caret"
                                style={{color:'grey', cursor:'pointer'}}
                            onClick={()=>this.vote(newsItem.objectID,index)}/></td>
                          <td className="flex-row newsDtails" role="cell">
                            <span className="newsItem">{newsItem.title}</span>
                            {
                              newsItem.url && (
                              <span className="newsdetails userdata newsItem">
                                    <a className="comhead" href={`from?site=${newsItem.url.hostname}`}>
                                        ({parse(newsItem.url).hostname} )
                                    </a>
                                </span>
                            )}
                            <span className="newsItem index">by </span>
                            <span className="newsItem">{newsItem.author}</span>
                            <span className="newsItem index"><TimeAgo date={newsItem.created_at} /></span>
                            <span className="index">[</span>
                            <span className="hide" onClick={()=>this.hide(newsItem)}>hide</span>
                            <span className="index">]</span>
                          </td>
                        </tr>
                      
                    )
                  })
                }
                </tbody>  
              </table>
              )}
              
              </main>
            {this.props.error?<div className="error">Error!!!</div>:null}
            <div key="morespace" className="morespace" style={{ height: '10px' }} />
            <div key="morelinktr" className="more">
              
              <span style={ (this.props.currentPage === 0) ? { display:'none'} : {}} onClick={this.goToPrevious}
                >
                  Previous
              </span>
                {' | '}
              <span onClick={this.getNextPage}> 
                  Next
              </span>
            </div>
             <div className="spacer"></div>

            <Line
              data={this.graphdata}
              options={{
                title:{
                  display:true,
                  text:'Votes vs Id',
                  fontSize:20
                },
                legend:{
                  display:true,
                  position:'right'
                }
              }}
            />
           </React.Fragment> 

        );
    }
}

Newsfeed.serverFetch = getData; // static declaration of data requirements

const mapStateToProps = ( state ) => ( {
    newsItems: state.fetchData.data,
    currentPage: state.fetchData.page,
    loading: state.fetchData.loading,
    error:state.fetchData.error  
} );

const mapDispatchToProps = ( dispatch ) => {
    return {
        onFetchData: (page) => dispatch( getData(page) ),
        onUpdatePage: (page) => dispatch( updatePageNum(page) ),
        onModifyData: (changeddata) => dispatch(modifyData(changeddata))
    }
};

export default connect( mapStateToProps, mapDispatchToProps )( Newsfeed );
