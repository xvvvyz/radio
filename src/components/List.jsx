import PropTypes from 'prop-types';
import React from 'react';
import shuffleSvg from '../icons/shuffle.svg';
import Tag from './Tag';
import '../styles/List.scss';

const List = props => !!props.items.length && (
  <div className="List">
    <div className="List_inner">
      {props.title && (
        <button className="List_header" onClick={props.shuffle}>
          <div className="List_title">{props.title}</div>
          <div className="List_shuffle">
            <img alt="shuffle" src={shuffleSvg} />
          </div>
        </button>
      )}
      <ul>
        {props.items.map((item, i) => <Tag
          image={typeof item === 'object' ? item.image : null}
          key={i}
          onClick={props.addTags}
          value={typeof item === 'object' ? item.name : item}
        />)}
      </ul>
    </div>
  </div>
);

List.propTypes = {
  addTags: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  shuffle: PropTypes.func,
  title: PropTypes.string,
};

export default List;
