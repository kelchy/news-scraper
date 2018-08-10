const App = (() => {
  const data = {
    scrapeRecord: null,
    articles: null
  }

  const init = () => {
    $('.tabs').tabs(); // Materialize tabs init
    
    $.get({ // Scrape Data
      url: '/api/scrape'
    }).then(result => {
      data.scrapeRecord = result.scrapeRecord;
      data.articles = result.articles;
      Render.removeLoader();
      Render.showAlert(JSON.stringify(data.scrapeRecord, undefined, 2));
      Render.showArticlesTable(data.articles);
    });

    $(document).on('click', '.save-article', (e) => {
      e.preventDefault();
  
      console.log('clicked');
    });
  }

  return {
    init
  }
})();

const Render = (() => {
  const removeLoader = () => {
    $('.loader-container').remove();
    $('#articles-tab .tab-content').removeClass('valign-wrapper');
  }

  const showAlert = (msg) => {
    $('.alert').text(msg);
    $('.alert').css('display', 'block');
    setTimeout(() => {
      $('.alert').css('display', 'none');
    }, 15000);
  }

  const showArticlesTable = (articles) => {
    $('#articles-tab table').css('display', 'table');
    for (const article of articles) {
      const $tdTitle = $('<td>', { 
        html: `
          <a href='${article.link}' target='_blank'>${article.title}</a>
          <a href='' class="save-article">[Save]</a>`

      });
      const $tdCategory = $('<td>', {text: article.category});
      const $tdSource = $('<td>', {text: article.source});
      const $tr = $('<tr>').append($tdTitle, $tdCategory, $tdSource);

      $('#articles-tab tbody').append($tr);
    };
  }

  return {
    removeLoader,
    showAlert,
    showArticlesTable
  }
})();

$(document).ready(() => {
  

  App.init();
  
});