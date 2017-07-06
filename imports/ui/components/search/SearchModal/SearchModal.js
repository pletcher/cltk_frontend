import React from 'react';

import IconButton from 'material-ui/IconButton';
import PropTypes from 'prop-types';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { createContainer } from 'meteor/react-meteor-data';

import Authors from '/imports/api/collections/authors';
import SearchFilters from '/imports/ui/components/search/SearchFilters/SearchFilters';
import SearchResultsList from '/imports/ui/components/search/SearchResultsList/SearchResultsList';
import SearchTools from '/imports/ui/components/search/SearchTools/SearchTools';
import Works from '/imports/api/collections/works';

class SearchModal extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			layout: 'grid',
		};

		this.works = [];
	}

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	}

	loadMoreWorks() {
		this.props.changeSearchParams({
			skip: this.props.skip + this.props.limit,
		});
	}

	toggleSearchTerm(key, value) {
		const filters = this.props.filters;
		let keyIsInFilter = false;
		let valueIsInFilter = false;
		let filterValueToRemove;
		let filterToRemove;

		filters.forEach((filter, i) => {
			if (filter.key === key) {
				keyIsInFilter = true;

				if (
						key === 'authors'
						&& filter.values.some((existingValue) =>
							existingValue._id === value._id
						)) {
					valueIsInFilter = true;
					filterValueToRemove = filter.values.indexOf(value);
				} else if (filter.values.indexOf(value) >= 0) {
					valueIsInFilter = true;
					filterValueToRemove = filter.values.indexOf(value);
				}

				if (valueIsInFilter) {
					filter.values.splice(filterValueToRemove, 1);
					if (filter.values.length === 0) {
						filterToRemove = i;
					}
				} else {
					filter.values.push(value);
				}
			}
		});


		if (typeof filterToRemove !== 'undefined') {
			filters.splice(filterToRemove, 1);
		}

		if (!keyIsInFilter) {
			filters.push({
				key,
				values: [value],
			});
		}

		this.props.changeSearchParams({
			filters,
			skip: 0,
		});
	}

	handleChangeTextsearch(textsearch) {
		const filters = this.props.filters;

		if (textsearch && textsearch.length) {
			let textsearchInFilters = false;

			filters.forEach((filter, i) => {
				if (filter.key === 'textsearch') {
					filters[i].values = [textsearch];
					textsearchInFilters = true;
				}
			});

			if (!textsearchInFilters) {
				filters.push({
					key: 'textsearch',
					values: [textsearch],
				});
			}
		} else {
			let filterToRemove;

			filters.forEach((filter, i) => {
				if (filter.key === 'textsearch') {
					filterToRemove = i;
				}
			});

			if (typeof filterToRemove !== 'undefined') {
				filters.splice(filterToRemove, 1);
			}
		}

		this.props.changeSearchParams({
			filters,
			skip: 0,
		});
	}

	handleChangeDate(e) {
		const filters = this.props.filters;

		let dateFromInFilters = false;

		filters.forEach((filter, i) => {
			if (filter.key === 'dateFrom') {
				filters[i].values = [e.from];
				dateFromInFilters = true;
			}
		});

		if (!dateFromInFilters) {
			filters.push({
				key: 'dateFrom',
				values: [e.from],
			});
		} else {
			let filterToRemove;

			filters.forEach((filter, i) => {
				if (filter.key === 'dateFrom') {
					filterToRemove = i;
				}
			});

			if (typeof filterToRemove !== 'undefined') {
				filters.splice(filterToRemove, 1);
			}
		}

		let dateToInFilters = false;

		filters.forEach((filter, i) => {
			if (filter.key === 'dateTo') {
				filters[i].values = [e.to];
				dateToInFilters = true;
			}
		});

		if (!dateToInFilters) {
			filters.push({
				key: 'dateTo',
				values: [e.to],
			});
		} else {
			let filterToRemove;

			filters.forEach((filter, i) => {
				if (filter.key === 'dateTo') {
					filterToRemove = i;
				}
			});

			if (typeof filterToRemove !== 'undefined') {
				filters.splice(filterToRemove, 1);
			}
		}

		this.props.changeSearchParams({
			filters,
			skip: 0,
		});
	}

	toggleLayout(layout) {
		this.setState({
			layout,
		});
	}

	closeSearchModal() {
		this.props.changeSearchParams({ filters: [] });
		this.props.closeSearchModal();
	}

	render() {
		let hasMoreWorks = true;

		if (this.works.length === 0 || this.props.skip === 0) {
			this.works = this.props.works;
		} else {
			this.props.works.forEach((workResult) => {
				if (!this.works.some((existingWork) =>
					workResult._id._str === existingWork._id._str
				)) {
					this.works.push(workResult);
				}
			});
		}

		const works = this.works;

		if (this.props.worksCount && this.props.worksCount <= this.works.length) {
			hasMoreWorks = false;
		} else if (this.props.works.length < this.props.limit) {
			hasMoreWorks = false;
		}

		return (
			<div
				className={`cltk-modal search-modal
				${(this.props.visible ? 'search-modal--visible' : '')}`}
			>
				<div className="close-search">
					<IconButton
						iconClassName={'close-search-icon mdi mdi-close'}
						onClick={this.closeSearchModal}
						onTouchTap={this.closeSearchModal}
					/>
				</div>

				{this.props.visible ?
					<div>
						<SearchTools
							filters={this.props.filters}
							toggleSearchTerm={this.toggleSearchTerm}
							handleChangeDate={this.handleChangeDate}
							handleChangeTextsearch={this.handleChangeTextsearch}
						/>
						<SearchFilters
							filters={this.props.filters}
							toggleSearchTerm={this.toggleSearchTerm}
						/>
						<section className="search-results">
							<SearchResultsList
								works={works}
								hasMoreWorks={hasMoreWorks}
								loadMore={this.loadMoreWorks}
							/>
						</section>
					</div>
					: ''
				}


			</div>
		);
	}
};

SearchModal.childContextTypes = {
	muiTheme: PropTypes.object.isRequired,
};

SearchModal.propTypes = {
	changeSearchParams: PropTypes.func.isRequired,
	closeSearchModal: PropTypes.func,
	filters: PropTypes.array,
	limit: PropTypes.number,
	skip: PropTypes.number,
	visible: PropTypes.bool,
	work: PropTypes.object,
};

const SearchModalContainer = createContainer(props => {
	const query = {};
	let works = [];
	let worksCount = null;
	let textSearch = null;

	// Parse the filters to the query
	props.searchParams.filters.forEach((filter) => {
		const date = moment(`${filter.values[0]}-01-01`, 'YYYY MM DD');
		switch (filter.key) {
		case 'textsearch': {
			query.$text = { $search: filter.values[0] };
			textSearch = { $regex: filter.values[0], $options: 'i' };
			break;
		}

		case 'languages': {
			query.workLanguage = { $in: filter.values };
			break;
		}

		case 'corpora': {
			query.corpus = { $in: filter.values };
			break;
		}

		case 'authors': {
			const values = [];

			filter.values.forEach((value) => {
				values.push(value._id);
			});

			query.authors = { $in: values };
			break;
		}

		case 'dateStart': {
			query.dateBegun = { $gte: new Date(date.toISOString()) };
			break;
		}

		case 'dateEnd': {
			query.dateEnded = { $lte: new Date(date.toISOString()) };
			break;
		}

		default: {
			// do nothing
		}
		}
	});

	const handle = Meteor.subscribe(
		'works',
		query,
		props.searchParams.skip,
		props.searchParams.limit
	);

	if (handle.ready()) {
		delete query.$text;
		if (textSearch) {
			query.$or = [{
				english_title: textSearch,
			}, {
				original_title: textSearch,
			}];
		}

		works = Works.find(query, {}).fetch();

		works.forEach((work, i) => {
			works[i].authors = Authors.find({ _id: { $in: work.authors } }).fetch();
		});

		works.sort((a, b) => {
			let sortVal = 1;
			if (a.authors[0].english_name > b.authors[0].english_name) {
				sortVal = 1;
			} else if (b.authors[0].english_name > a.authors[0].english_name) {
				sortVal = -1;
			} else {
				sortVal = 0;
			}

			return sortVal;
		});
	}

	worksCount = Counts.get('worksCount');

	return {
		...props,
		...props.searchParams,
		works,
		worksCount,
	};
}, SearchModal);

export default SearchModalContainer;
