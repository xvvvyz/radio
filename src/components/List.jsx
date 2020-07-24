import PropTypes from 'prop-types';
import React from 'react';
import shuffleSvg from '../images/shuffle.svg';
import Tag from './Tag';
import './List.scss';

const List = (props) =>
  !!props.items.length && (
    <div className="List">
      {props.title && (
        <div className="List_header">
          <button onClick={props.shuffle}>
            <div className="List_title">{props.title}</div>
            <div className="List_shuffle">
              <img alt="shuffle" src={shuffleSvg} />
            </div>
          </button>
        </div>
      )}
      <ul>
        {props.items.map((item, i) => (
          <Tag
            image={typeof item === 'object' ? item.image : null}
            key={i}
            onClick={props.addTags}
            value={typeof item === 'object' ? item.name : item}
          />
        ))}
      </ul>
    </div>
  );

List.propTypes = {
  addTags: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  shuffle: PropTypes.func,
  title: PropTypes.string,
};

export default List;
