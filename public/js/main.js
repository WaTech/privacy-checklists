(function ($) {

	function slicedText (element, number) {
		element.each(function () {
			var text = $(this).text().trim();
			var sliced = text.slice(0, number);
			sliced += '...';
			if (text.length > number) {
				$(this).text(text.replace(text, sliced));
			}
		});
	}

	var checklistSlicedText = $('.checklists__item, .posts__entry-container--text').find('p');
	var blogSlicedText = $('.number-2, .number-3, .number-4').find('p');
	var blogFiledUnder = $('.number-2, .number-3, .number-4').find('span');
	var titleChecklist = $('.checklists__item--title');
	var titlePost = $('.posts__title');
	var filedUnderPost = $('.posts__item--filed-under');

	slicedText(checklistSlicedText, 93);
	slicedText(blogSlicedText, 27);
	slicedText(titleChecklist, 38);
	slicedText(titlePost, 36);
	slicedText(filedUnderPost, 67);
	slicedText(blogFiledUnder, 42);

//    Display variants checklist

	var checklists = $('.checklists');
	var checklistsItem = $('.checklists__item');
	var viewListItem = $('.list');
	var viewBlockItem = $('.block');

	if ($(window).width() < 768) {
		checklists.removeClass('variants-list');
		checklistsItem.removeClass('checklists__item-list');
	}

	viewListItem.on('click', function (e) {
		e.preventDefault();

		checklists.removeClass('variants-block').addClass('variants-list');
		checklistsItem.removeClass('checklists__item-block').addClass('checklists__item-list');

		$(this).addClass('btn-list');
		viewBlockItem.addClass('btn-block');
	});

	viewBlockItem.on('click', function (e) {
		e.preventDefault();

		checklists.removeClass('variants-list').addClass('variants-block');
		checklistsItem.removeClass('checklists__item-list').addClass('checklists__item-block');

		$(this).removeClass('btn-block');
		viewListItem.removeClass('btn-list');
	});

//    Display categories

	$('.link-categories').on('click', function (e) {
		e.preventDefault();

		$(this).toggleClass('link-categories--open');
		$('.checklists__entry-container-categories, .blog__entry-container-categories').toggleClass('categories');
		$('.checklists__entry-container, .blog__entry-container').toggleClass('categories--open');
	});

//    Display more checklists

	$('.checklists__link--link-more--open').on('click', function (e) {
		e.preventDefault();

		checklistsItem.css('display', 'initial');
		$('.checklists__link--entry-container').hide();
	});

	function windowSize () {
		if ($(window).width() <= '749') {
			checklists.removeClass('variants-list');
			checklistsItem.removeClass('checklists__item-list');
		}
		if ($(window).width() > '769') {
			$('.checklists__entry-container-categories').removeClass('categories');
			$('.link-categories').removeClass('link-categories--open');
			$('.checklists__entry-container').removeClass('categories--open');
		}
	}

	$(window).resize(windowSize);

//    Check Download PDF

	var checklistID = jQuery.parseJSON(localStorage.getItem('checklistID')) || [];

	$('.container-checklist__link-download').on('click', function (e) {
		e.preventDefault();

		checklistID.push($('#checklist-form').attr('data-post-id'));
		localStorage.setItem('checklistID', JSON.stringify(checklistID));
	});

	$.each(checklistID, function (i, val) {
		var idCheklist = val;

		$.each($('.checklists__item'), function () {
			if (idCheklist === $(this).attr('id')) {
				$(this).find('.checklists__item--entry-container').addClass('checked');
				$(this).find('.checklists__item--entry-container-link').html('Checked');
			}
		});

	});

//    Search / autocomplete

	var inputHeroForm = $('.hero__form-input');
	var searchResultsList = $('.search__results--list');
	var state = null;

	searchResultsList.hide();

	function search (value) {

		$.ajax({
			url: '/api/search?q=' + value,
			dataType: 'json',
			success: function (data) {
				searchResultsList.empty();
				searchResultsList.show();
				autocomplete('#q', data.results);
			},
		});
	}

	function debounce (value, time) {
		var timer = setTimeout(function () {
			if (state === value && value !== '') {
				search(value);
			} else {
				clearTimeout(timer);
			}

			if (value === '') {
				searchResultsList.hide();
			}

		}, time);
		state = value;
	}

	inputHeroForm.bind('input', function () {
		if (this.value === '') {
			searchResultsList.empty();
			searchResultsList.hide();
		}
		state = this.value;
		debounce(this.value, 500);
	});

	inputHeroForm.on('focus', function (e) {
		if ($('.search__results--list > li').length) {
			$('.search__results--list').show();
		}
	});


	/**
	 * Autocomplete
	 *
	 * @param input Search input
	 * @param data Autocomplete data
	 */
	function autocomplete (input, data) {
		var currentFocus = -1;
		var search = $(input);

		$.each(data, function (i, item) {
			$('.search__results--list').append(
				'<li class="search__results--list-item" tabindex="-1">'
				+ '<h3 class="search__results--list-item__title">'
				+ item.title
				+ '</h3>'
				+ '<input type="hidden" value="' + item.title + '">'
				+ '</li>'
			);
		});

		$('.search__results--list-item').on('click', function (e) {
			search.val($(this).find('input').val());
			$('.hero__form-search').submit();
		});

		search.on('focus click', function (e) {
			e.stopPropagation();
			searchResultsList.show();
		});

		search.on('keydown', function (e) {
			var items = $('.autocomplete-items');

			if (items.length) {
				items = items.find('li');
			}

			if (e.keyCode === 40) {
				currentFocus++;
				addActive(items);
			} else if (e.keyCode === 38) {
				currentFocus--;
				addActive(items);
			} else if (e.keyCode === 13) {
				e.preventDefault();
				if (currentFocus > -1) {
					if (items.length) $(items[currentFocus]).click();
					$('.hero__form-search').submit();
				}
			}
		});

		function addActive (items) {
			if (!items) return false;
			removeActive(items);
			if (currentFocus >= items.length) currentFocus = 0;
			if (currentFocus < 0) currentFocus = (items.length - 1);
			$(items[currentFocus]).addClass('selected');
		}

		function removeActive (items) {
			for (var i = 0; i < items.length; i++) {
				$(items[i]).removeClass('selected');
			}
		}

		function closeAllLists () {
			searchResultsList.hide();
		}

		$(document).on('click', function () {
			closeAllLists();
		});
	}

	var windowLocation = window.location.href;

// Scrolling checklist navigation

	var containerChecklistNav = $('.container-checklist__nav');
	var containerSharing = $('.sharing-container');
	var containerSharingPost = $('.sharing-container__post');
	var target = $('.posts-wrapper, .related-checklists-wrapper, .privacy-modeling-wrapper');
	var targetPos = target.offset().top;
	var winHeight = $(window).height();
	var scrollToElem = targetPos - winHeight;

	$(window).scroll(function () {
		var winScrollTop = $(this).scrollTop();

		if (winScrollTop > scrollToElem) {
			containerChecklistNav.addClass('scroll-checklist__nav');
			containerSharing.addClass('scroll-checklist__nav');
			containerSharingPost.addClass('scroll-checklist__nav');

		} else {
			containerChecklistNav.removeClass('scroll-checklist__nav');
			containerSharing.removeClass('scroll-checklist__nav');
			containerSharingPost.removeClass('scroll-checklist__nav');
		}

		if (winScrollTop >= 100) {
			containerChecklistNav.addClass('scroll-checklist__nav-main');
		} else {
			containerChecklistNav.removeClass('scroll-checklist__nav-main');
		}

	});

	$('.container-checklist__nav-list-item-link[href^="#"]').on('click', function (e) {
		e.preventDefault();

		$('.container-checklist__nav-list-item-link').removeClass('active');
		$(this).addClass('active');

		var target = this.hash;

		$('html, body').stop().animate({
			scrollTop: $(target).offset().top,
		}, 800, 'swing', function () {
			window.location.hash = target;
		});
	});

	$('.container-checklist__nav-list-item-link').first().addClass('active');

//    Search animation

	var searchOverlay = $('.search-overlay');

	searchOverlay.fadeIn();
	searchOverlay.parents('body').addClass('scroll-animate');

	setTimeout(function () {
		searchOverlay.fadeOut();
		searchOverlay.parents('body').removeClass('scroll-animate');
	}, 2500);

//	Sharing button


	$('.sharing-container__link--facebook')
    .attr('href', 'https://facebook.com/sharer/sharer.php?u=' + windowLocation);
	$('.sharing-container__link--twitter').attr('href', 'https://twitter.com/intent/tweet/?url=' + windowLocation);
	$('.sharing-container__link--linkedIn')
    .attr('href', 'https://www.linkedin.com/shareArticle?mini=true&amp;url=' + windowLocation);
	$('.sharing-container__link--google').attr('href', 'https://plus.google.com/share?url=' + windowLocation);


	$('.js-checklist-download').on('click', function (e) {
		var btnDownload = $('.js-checklist-download');
		var form = $('#checklist-form');
		var postId = form.attr('data-post-id');
		var listItems = form.find('li');
		var data = {
			id: postId,
			items: [],
		};

		listItems.each(function (i, el) {
			var id = $(el).attr('id');
			var isItemsChecked = $(el).find('input:checked');
			var items = {
				id: id,
				items: [],
			};

			isItemsChecked.each(function (i, el) {
				items.items.push($(el).attr('data-key'));
			});

			data.items.push(items);
		});

		$.ajax({
			method: 'POST',
			url: '/api/download',
			data: data,
			beforeSend: function () {
				btnDownload.attr('disabled', true).hide();
				$('.loader').show();
			},
		}).done(function (data) {
			btnDownload.hide();
			$('<a class="container-checklist__link-download js-download-file" href="' + data.fileUrl + '" target="_blank">Open File</a>').insertAfter(btnDownload);
		}).fail(function () {
			var errorContainer = $('.error-container');

			errorContainer.show();
			btnDownload.show();
			setTimeout(function () {
				errorContainer.fadeOut(1000);
			}, 2000);
		}).always(function () {
			btnDownload.attr('disabled', false);
			$('.loader').hide();
		});
	});

	$('.container-checkbox--input').on('change', function (e) {
		$('.js-checklist-download').show();
		$('.js-download-file').remove();
	});

	$(document).on('click', '.js-tags-all', function (e) {
		e.preventDefault();
		$(this).parent().toggleClass('open');
	});

})(jQuery);
