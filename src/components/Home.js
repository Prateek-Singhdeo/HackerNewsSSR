import React from "react";
import { connect } from "react-redux";
import {Line} from 'react-chartjs-2';
import { getData, updatePageNum, modifyData } from "../store/actions/index";
import NewsTitle from '../components/newstitle';
import NewsFooter from '../components/newsfooter';
import './newsfeed.css'

class Home extends React.Component {
    constructor ( props ) {
        super( props );
    
        this.vote = this.vote.bind(this);
        this.getNextPage = this.getNextPage.bind(this);
        this.goToPrevious = this.goToPrevious.bind(this);
        this.hide = this.hide.bind(this);
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
        console.log('here');
    }

    componentDidUpdate(prevprops) {
        if(prevprops.currentPage !==this.props.currentPage) {
          this.props.onFetchData(this.props.currentPage);
        }
    }
    
    vote(itemId){
        const likedData = this.props.newsItems.hits.map((news)=>{
          if(news.objectID === itemId) {
            let votes = news.upvote?news.upvote+1:1
            return {
              ...news,
              upvote: votes
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
        const modifiedData = this.props.newsItems.hits.map((news)=>{
          if(news.objectID === item.objectID) {
            return {
              ...news,
              hidden: true
            }
          }
          return news;
        });
        const modifiedpageData = {
          ...this.props.newsItems,
          hits:modifiedData
        }
        this.props.onModifyData(modifiedpageData);
      }

    render( ) {
        let filteredNews = this.props.newsItems.hits && this.props.newsItems.hits.filter((item)=>{
            return item.hidden !== true;
          })
          let allNews = {
            ...this.props.newsItems,
            hits:filteredNews
          };
          if(allNews && allNews.hits) {
            this.graphdata.datasets[0].data = allNews.hits.map((value)=>{
              return value.upvote;
            })
            this.graphdata.labels = allNews.hits.map((value)=>{
              return value.objectID;
            })
          }

        return (
            <React.Fragment>
              <main className="newsfeed">
                
                <React.Fragment>{
                    this.props.loading ? <div>Loading...</div> :
                    
                    allNews && allNews.hits && allNews.hits.map((newsItem,index) => {
                        return (
                            <React.Fragment key={index+newsItem.title+newsItem.objectID}>
                                <NewsTitle  url={newsItem.url} title={newsItem.title} vote={()=>this.vote(newsItem.objectID)}index={allNews.page?(allNews.page-1)*allNews.hitsPerPage+index:index}/>
                                <NewsFooter upvotes={newsItem.upvote}comments={newsItem.num_comments} author={newsItem.author} points={newsItem.points} createdAt={newsItem.created_at} hide={()=>this.hide(newsItem)}/>
                            </React.Fragment>
                        )}
                       ) 
                  }
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
              </main> 
            </React.Fragment> 

        );
    }
}
Home.serverFetch = getData; // static declaration of data requirements

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

export default connect( mapStateToProps, mapDispatchToProps )( Home );
