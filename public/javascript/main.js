const App = (() => {
  const data = {
    scrapeRecord: null,
    articles: null
  }

  const init = () => {
    $('.tabs').tabs(); // Materialize tabs init
    $('.collapsible').collapsible(); // Materialize collapsible init
    
    $.get({ // Scrape Data
      url: '/api/scrape'
    }).then(result => {
      data.scrapeRecord = result.scrapeRecord;
      data.articles = result.articles;
      Render.removeLoader();
      Render.showAlert(JSON.stringify(data.scrapeRecord, undefined, 2));
      Render.showFilterSettings();
      Render.showArticlesTable(data.articles);
    });

    $(document).on('click', '.save-article', function(e) {
      e.preventDefault();

      const newArticle = {
        source: $(this).parent().parent().find('td:eq(2)').text(),
        category: $(this).parent().parent().find('td:eq(1)').text(),
        title: $(this).parent().find('a:eq(0)').text(),
        link: $(this).parent().find('a').attr('href')
      };

      $.post({
        url: '/api/articles',
        data: newArticle
      }).then(result => {
        data.articles = data.articles.filter((article) => article.title !== newArticle.title);
        $(this).parent().parent().remove();
      });
    });

    $('#articles-tab input[type="checkbox"]').on('change', () => {
      let sources = [];
      let categories = [];

      $('#source-filter input[type="checkbox"]:checked').each(function(){
        sources.push($(this).val()); 
      });
      $('#category-filter input[type="checkbox"]:checked').each(function(){
        categories.push($(this).val()); 
      });

      const filtered = data.articles.filter((article) => sources.includes(article.source) && categories.includes(article.category));
      Render.showArticlesTable(filtered);
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

  const showFilterSettings = () => {
    $('#filter-settings').css('display', 'block');
  }

  const showArticlesTable = (articles) => {
    $('#articles-tab tbody').empty();
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
    showFilterSettings,
    showArticlesTable
  }
})();

$(document).ready(() => {
  App.init();  
});